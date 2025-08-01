document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("excelUpload");
  const contentContainer = document.getElementById("newsletter-content");
  const sendEmailBtn = document.getElementById("sendEmailBtn");

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      contentContainer.innerHTML = ""; // Clear existing content

      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        const section = document.createElement("div");
        section.className = "newsletter-section";
        section.innerHTML = `<h2>${sheetName}</h2>`; // ✅ fixed typo here

        rows.forEach((row) => {
          const { Heading, ["Sub heading"]: SubHeading, Details, ["Expert Comment"]: ExpertComments, Image, Source } = row;

          const article = document.createElement("div");
          article.innerHTML = `
            <h3>${Heading}</h3>
            <p class="summary">${SubHeading}</p>
            <p>${Details}</p>
            ${ExpertComments ? `<p><strong>Expert Comments: ${ExpertComments}</strong></p>` : ""}
            ${Image ? `<img src="${Image}" alt="Image" style="display: block; margin: 20px auto; max-width: 100%; height: auto; border-radius: 5px;" />` : "<p>Bild einfügen</p>"}
            ${Source ? `<p><a href="${Source}" target="_blank">Source</a></p>` : ""}
          `;
          section.appendChild(article);
        });

        contentContainer.appendChild(section);
      }

      document.getElementById("week-label").textContent = "Data Loaded from Excel";
    };

    reader.readAsArrayBuffer(file);
  });

  // ✅ Attach event only after DOM is loaded
  sendEmailBtn.addEventListener("click", () => {
    const htmlContent = document.documentElement.outerHTML;

    sendEmailBtn.disabled = true;
    sendEmailBtn.textContent = "Sending...";

    fetch("/send-newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "recipient@example.com",
        subject: "Weekly Newsletter",
        html: htmlContent
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        sendEmailBtn.disabled = false;
        sendEmailBtn.textContent = "Send Newsletter via Email";
      })
      .catch(err => {
        console.error("Failed to send email", err);
        alert("Failed to send email.");
        sendEmailBtn.disabled = false;
        sendEmailBtn.textContent = "Send Newsletter via Email";
      });
  });
});
