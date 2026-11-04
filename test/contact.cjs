/* Offline mailto contract: no real email client or provider is invoked. */
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const {prepare, bind, MAX_URL_LENGTH, RECIPIENT, SUBJECT, HANDOFF, FAILURE} = require('../js/contact-mailto');
function fixture(message, open = () => {}) {
  const listeners = {};
  const attrs = {};
  const input = {value:message,validationMessage:'',reported:0,
    addEventListener(name, fn) {listeners['input:'+name] = fn;},
    setCustomValidity(text) {this.validationMessage=text;},
    setAttribute(k,v) {attrs[k]=v;},removeAttribute(k) {delete attrs[k];},
    reportValidity() {this.reported++;},
  };
  const form={addEventListener(name,fn){listeners['form:'+name]=fn;}};
  const status={textContent:'',hidden:true};
  bind(form,input,status,open);
  return {input,status,attrs,submit(){let prevented=false;listeners['form:submit']({preventDefault(){prevented=true;}});assert(prevented);},edit(value){input.value=value;listeners['input:input']();}};
}
test('empty, whitespace, control and malformed Unicode input do not create handoff URLs',()=>{
  for(const body of ['', '  \n\t ', '\u0000hello', 'hello\u007f', '\ud800']) {
    const prepared=prepare(body);assert(prepared.error);assert.equal(prepared.url,undefined);
  }
});
test('body is encoded as data with fixed recipient and subject; Unicode and multiline survive',()=>{
  const body='hi &bcc=elsewhere@example.test?subject=changed\nこんにちは 🎵 + # %';
  const prepared=prepare(body);assert(prepared.url);
  const url=new URL(prepared.url);
  assert.equal(url.protocol,'mailto:');assert.equal(url.pathname,RECIPIENT);
  assert.deepEqual([...url.searchParams.keys()],['subject','body']);
  assert.equal(url.searchParams.get('subject'),SUBJECT);
  assert.equal(url.searchParams.get('body'),body.replace('\n','\r\n'));
});
test('encoded URL boundary is enforced without truncating a long draft',()=>{
  const prefix=prepare('x').url.length-1;
  assert.equal(prepare('x'.repeat(MAX_URL_LENGTH-prefix)).url.length,MAX_URL_LENGTH);
  assert(prepare('x'.repeat(MAX_URL_LENGTH-prefix+1)).error);
  assert(prepare('🎵'.repeat(200)).error,'Unicode expansion counts toward URL budget');
});
test('successful navigation attempt is only a handoff and preserves the draft',()=>{
  const urls=[];const body='my question\nsecond line';const state=fixture(body,url=>urls.push(url));
  state.submit();assert.equal(urls.length,1);assert.equal(state.input.value,body);
  assert.equal(state.status.textContent,HANDOFF);assert.equal(state.status.hidden,false);
  assert.match(state.status.textContent,/may open/);assert.doesNotMatch(state.status.textContent,/sent|delivered|success/i);
});
test('navigation exception gives truthful recovery and preserves draft for retry',()=>{
  let calls=0;const body='my question';const state=fixture(body,()=>{calls++;throw new Error('blocked');});
  state.submit();assert.equal(calls,1);assert.equal(state.status.textContent,FAILURE);assert.equal(state.input.value,body);
  state.submit();assert.equal(calls,2);assert.equal(state.input.value,body);
});
test('invalid and long input never navigates and remains editable',()=>{
  for(const body of ['   ','message\u0000','x'.repeat(10000)]) {
    let calls=0;const state=fixture(body,()=>calls++);state.submit();
    assert.equal(calls,0);assert.equal(state.input.value,body);assert(state.status.textContent);
    assert.equal(state.attrs['aria-invalid'],'true');assert.equal(state.input.reported,1);
    state.edit('fixed question');assert.equal(state.input.validationMessage,'');assert.equal(state.attrs['aria-invalid'],undefined);
    assert.equal(state.status.hidden,true);state.submit();assert.equal(calls,1);
  }
});
test('HTML retains noJS mailto, native required validation, visible copy fallback and honest action',()=>{
  const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
  const section=html.match(/<section class="contact-section"[\s\S]*?<\/section>/)[0];
  assert.match(section,/<form class="ask" data-contact-mailto action="mailto:elxyee@gmail.com" method="get"/);
  assert.match(section,/<textarea[^>]+ required /);assert(!section.includes('maxlength='),'no silent truncation');
  assert(section.includes('>open email app</button>'));assert(!section.includes('>send it</button>'));
  assert(section.includes('nothing is sent from this page.'));
  assert(section.includes('if your email app does not open or the draft is incomplete'));
  assert(section.includes('href="mailto:elxyee@gmail.com">elxyee@gmail.com</a>'));
  assert(section.includes('aria-describedby="contact-help contact-status"'));
  assert(section.includes('role="status" aria-live="polite" hidden'));
  assert(html.includes('</section><script src="js/contact-mailto.js" defer></script>'));
});
test('browser code has no network/provider, draft storage, automatic send or reset path',()=>{
  const source=fs.readFileSync(path.join(__dirname,'../js/contact-mailto.js'),'utf8');
  assert(!/fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|\.reset\(/.test(source));
  assert(!/input\.value\s*=/.test(source));
  assert(!source.includes('/api/contact'));assert(source.includes('root.location.assign(url)'));
});
