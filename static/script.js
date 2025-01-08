const tabLinks = document.querySelectorAll('.tab-link');
const tabContents = document.querySelectorAll('.tab-content');

tabLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Remove active class from all links
    tabLinks.forEach(link => link.classList.remove('active'));
    // Add active class to clicked link
    link.classList.add('active');

    // Hide all tab contents
    tabContents.forEach(content => content.classList.remove('active'));

    // Show current tab content
    const targetTab = document.getElementById(link.dataset.tab);
    targetTab.classList.add('active');
  });
});