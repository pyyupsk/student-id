const API_URL =
  "https://script.google.com/macros/s/AKfycbyJcgraL-b7XUxVsOAqoaWOPQwDxtf1xKs3MousYvpBAQdjRbb_zGJJ2fliSITxwlG3TA/exec";

const form = document.getElementById("form");
const input = document.getElementById("input");
const btn = document.getElementById("btn");
const errorEl = document.getElementById("error");
const resultEl = document.getElementById("result");
const foundTpl = document.getElementById("tpl-found");
const notFoundTpl = document.getElementById("tpl-not-found");

let controller = null;

input.addEventListener("input", () => {
  input.value = input.value.replaceAll(/\D/g, "").slice(0, 13);
  errorEl.hidden = true;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = input.value.trim();

  if (id.length !== 13) {
    errorEl.textContent = "กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก";
    errorEl.hidden = false;
    input.focus();
    return;
  }

  if (controller) controller.abort();
  controller = new AbortController();

  btn.disabled = true;
  btn.textContent = "กำลังค้นหา…";
  errorEl.hidden = true;
  clearResult();

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ cardId: id }),
      signal: controller.signal,
    });
    const data = await res.json();

    if (data.success) {
      showFound(data.data);
      input.value = "";
    } else if (data.error === "NOT_FOUND") {
      showNotFound();
    } else {
      errorEl.textContent = data.message || "เกิดข้อผิดพลาด";
      errorEl.hidden = false;
    }
  } catch (err) {
    if (err.name === "AbortError") return;
    console.error(err);
    errorEl.textContent = "ไม่สามารถเชื่อมต่อระบบได้ ลองใหม่อีกครั้ง";
    errorEl.hidden = false;
  } finally {
    controller = null;
    btn.disabled = false;
    btn.textContent = "ค้นหา";
  }
});

resultEl.addEventListener("click", async (e) => {
  const copyBtn = e.target.closest("[data-copy]");
  if (!copyBtn) return;

  const studentId = copyBtn
    .closest(".result-card")
    .querySelector("[data-student-id]").textContent;
  const copyText = copyBtn.querySelector("[data-copy-text]");

  try {
    await navigator.clipboard.writeText(studentId);
    copyText.textContent = "คัดลอกแล้ว";
  } catch {
    copyText.textContent = "คัดลอกไม่ได้";
  }

  setTimeout(() => {
    copyText.textContent = "คัดลอกรหัส";
  }, 2000);
});

const showFound = (data) => {
  const clone = foundTpl.content.cloneNode(true);
  clone.querySelector("[data-name]").textContent = data.name;
  clone.querySelector("[data-student-id]").textContent = data.studentId;
  resultEl.replaceChildren(clone);
};

const showNotFound = () => {
  resultEl.replaceChildren(notFoundTpl.content.cloneNode(true));
};

const clearResult = () => {
  resultEl.replaceChildren();
};
