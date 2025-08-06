// === Page navigation ===
function nextPage(pageNum) {
  document.querySelectorAll('.form-page').forEach(p => p.style.display = 'none');
  document.getElementById('page' + pageNum).style.display = 'block';
}

function prevPage(pageNum) {
  document.querySelectorAll('.form-page').forEach(p => p.style.display = 'none');
  document.getElementById('page' + pageNum).style.display = 'block';
}

// === Page Load Events ===
window.onload = function () {
  // Preferred name checkbox
  const preferredCheck = document.getElementById("preferredCheck");
  if (preferredCheck) {
    preferredCheck.addEventListener("change", function () {
      document.getElementById("preferredNameBlock").style.display = this.checked ? "block" : "none";
    });
  }

  // School checkbox
  const schoolCheck = document.getElementById("schoolCheck");
  if (schoolCheck) {
    schoolCheck.addEventListener("change", function () {
      document.getElementById("schoolBlock").style.display = this.checked ? "block" : "none";
    });
  }

  // Relocate field
  const relocateSelect = document.getElementById("relocateSelect");
  if (relocateSelect) {
    relocateSelect.addEventListener("change", function () {
      document.getElementById("relocateCityLabel").style.display = this.value === "Yes" ? "block" : "none";
    });
  }

  // Referral email condition
  const refSource = document.getElementById("refSource");
  if (refSource) {
    refSource.addEventListener("input", function () {
      document.getElementById("refEmailLabel").style.display = this.value.toLowerCase().includes("referral") ? "block" : "none";
    });
  }
};

// === Add Skills (limit 5) ===
function addSkill() {
  const skillInput = document.getElementById("skillsInput");
  const skillList = document.getElementById("skillsList");
  if (skillList.children.length >= 5 || !skillInput.value.trim()) return;
  const li = document.createElement("li");
  li.textContent = skillInput.value;
  skillList.appendChild(li);
  skillInput.value = "";
}

// === Form Submission ===
document.getElementById("resumeForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  // Collect form data
  const formData = {};
  const formElements = this.querySelectorAll("input, select, textarea");
  formElements.forEach(el => {
    if (!el.name) return;
    if (el.type === "checkbox") {
      formData[el.name] = el.checked;
    } else if (el.type === "file") {
      formData[el.name] = el.files.length > 0 ? el.files[0].name : null;
    } else {
      formData[el.name] = el.value;
    }
  });

  // Add skills from list
  const skills = [];
  document.querySelectorAll("#skillsList li").forEach(li => skills.push(li.textContent));
  formData.skills = skills;

  // Add timestamp
  formData.timestamp = new Date();

  try {
    // Save to Firestore
    const docRef = await db.collection("resumes").add(formData);
   // const viewLink = `${window.location.origin}/view.html?id=${docRef.id}`;
    const viewLink = `https://resumeform-15d2a.web.app/view.html?id=${docRef.id}`;


    // Show success + link + QR
    document.querySelector(".container").innerHTML = `
      <h2>✅ Submission Successful!</h2>
      <p>Share this link with HR:</p>
      <p><a href="${viewLink}" target="_blank">${viewLink}</a></p>
      <p>Or scan this QR:</p>
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(viewLink)}" alt="QR Code" />
    `;

  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Error saving data. Check console for details.");
  }
});
