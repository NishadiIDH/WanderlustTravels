document.addEventListener("DOMContentLoaded", () => {

document.getElementById('lastUpdated').textContent = document.lastModified;
document.getElementById('year').textContent = new Date().getFullYear();

 // Example starter JavaScript for disabling form submissions if there are invalid fields
            (() => {
                'use strict'

            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            const forms = document.querySelectorAll('.needs-validation')

            // Loop over them and prevent submission
            Array.from(forms).forEach(form => {
                form.addEventListener('submit', event => {
                    if (!form.checkValidity()) {
                        event.preventDefault()
                        event.stopPropagation()
                    }

                form.classList.add('was-validated')
                }, false)
                })
            })()

  // Toggle buttons
  const toggleButtons = [
    { btn: "toggleBtn1", content: "extraContent1" },
    { btn: "toggleBtn2", content: "extraContent2" },
    { btn: "toggleBtn3", content: "extraContent3" },
    { btn: "toggleBtn4", content: "extraContent4" },
  ];

  toggleButtons.forEach(({ btn, content }) => {
    const button = document.getElementById(btn);
    const section = document.getElementById(content);
    if (button && section) {
      button.addEventListener("click", function () {
        section.style.display = section.style.display === "none" ? "block" : "none";
        this.textContent = section.style.display === "block" ? "Show Less" : "Show More";
      });
    }
  });

  document.getElementById("tripSearchForm").addEventListener("submit", function(e){
    e.preventDefault(); // stop page reload
    const destination = document.getElementById("destination").value;
    const date = document.getElementById("date").value;
    const travellers = document.getElementById("travellers").value;
    
    alert(`Searching for: \nDestination: ${destination}\nDate: ${date}\nTravellers: ${travellers}`);
  });

 const toggleBtn = document.getElementById("darkModeToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      // Update button text
      toggleBtn.textContent = document.body.classList.contains("dark-mode")
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";

      // Save preference
      localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    });

    // Load saved preference
    if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark-mode");
      toggleBtn.textContent = "☀️ Light Mode";
    }
  }
});





