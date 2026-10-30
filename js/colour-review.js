// Task 01: an opt-in colour-placement comparison. Existing motion and product logic stay owned by assembly.js.
const option = new URLSearchParams(location.search).get('colour')?.toUpperCase();
if (['A', 'B', 'C'].includes(option)) {
  document.documentElement.dataset.colourReview = option;
  document.addEventListener('DOMContentLoaded', () => {
    const fields = {
      '.hero':'155', '#demo':'037', '#inside':'010', '#flow':'044', '#deep':'183',
      '#stats':'185', '#features':'145', '#more':'009', '#portal':'034', '#steps':'170',
      '#price':'189', '#contact':'150', '#close':'192', '#footer':'005',
    };
    if (option === 'B') for (const [selector, ref] of Object.entries(fields)) {
      const section = document.querySelector(selector);
      section.dataset.colourRef = ref;
      section.style.setProperty('--colour-field', `url('/assets/colour-review/field-${ref}.webp')`);
    }
  }, {once:true});
}
