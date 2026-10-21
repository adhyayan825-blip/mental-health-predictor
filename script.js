// MindMetric frontend. API URL, request keys and response key preserved from the original app.
const API_URL = "https://mental-health-predictor-u80p.onrender.com/predict";

const form = document.getElementById("predict-form");
const button = document.getElementById("predict-btn");
const buttonLabel = button.querySelector("span:first-child");

const panels = {
  idle: document.getElementById("state-idle"),
  loading: document.getElementById("state-loading"),
  success: document.getElementById("state-success"),
  error: document.getElementById("state-error"),
};

function showPanel(name) {
  for (const key in panels) {
    panels[key].hidden = key !== name;
  }
}

function formatHours(value) {
  const number = Number(value);
  const formatted = Number.isInteger(number) ? String(number) : number.toFixed(1);
  return `${formatted} ${number === 1 ? "hour" : "hours"}`;
}

document.querySelectorAll('input[type="range"]').forEach((slider) => {
  const output = document.querySelector(`output[for="${slider.id}"]`);
  const update = () => {
    if (output) output.textContent = formatHours(slider.value);
  };
  slider.addEventListener("input", update);
  update();
});

function buildPayload() {
  return {
    age: Number(form.age.value),
    gender: form.gender.value,
    country: form.country.value.trim(),
    academic_level: form.academic_level.value,
    most_used_platform: form.most_used_platform.value,
    purpose_of_use: form.purpose_of_use.value,
    avg_daily_usage_hours: Number(form.avg_daily_usage_hours.value),
    daily_unlocks: Number(form.daily_unlocks.value),
    study_hours: Number(form.study_hours.value),
    physical_activity_hours: Number(form.physical_activity_hours.value),
    sleep_hours_per_night: Number(form.sleep_hours_per_night.value),
    stress_level: form.stress_level.value,
  };
}

function validate(p) {
  const errors = {};

  if (form.age.value === "" || !Number.isInteger(p.age) || p.age < 10 || p.age > 100) {
    errors.age = "Enter a whole number between 10 and 100.";
  }
  if (!p.gender) errors.gender = "Choose a gender.";
  if (!p.country) errors.country = "Enter a country.";
  if (!p.academic_level) errors.academic_level = "Choose an academic level.";
  if (!p.most_used_platform) errors.most_used_platform = "Choose a platform.";
  if (!p.purpose_of_use) errors.purpose_of_use = "Choose a purpose.";
  if (form.daily_unlocks.value === "" || !Number.isInteger(p.daily_unlocks) || p.daily_unlocks < 0) {
    errors.daily_unlocks = "Enter a whole number, 0 or more.";
  }
  if (!p.stress_level) errors.stress_level = "Choose a stress level.";

  return errors;
}

function showErrors(errors) {
  document.querySelectorAll("[data-error-for]").forEach((el) => {
    el.textContent = "";
    const field = el.closest(".field");
    if (field) field.classList.remove("invalid");
  });

  for (const name in errors) {
    const el = document.querySelector(`[data-error-for="${name}"]`);
    if (el) {
      el.textContent = errors[name];
      const field = el.closest(".field");
      if (field) field.classList.add("invalid");
    }
  }

  const first = Object.keys(errors)[0];
  if (first) {
    const target = form.elements[first];
    if (target) (target.focus ? target : target[0]).focus();
  }
}

function clearResultProgress() {
  const fill = document.getElementById("score-track-fill");
  if (fill) fill.style.width = "0%";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = buildPayload();
  const errors = validate(payload);
  showErrors(errors);
  if (Object.keys(errors).length > 0) return;

  showPanel("loading");
  clearResultProgress();
  button.disabled = true;
  buttonLabel.textContent = "Generating…";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(await describeHttpError(response));

    const data = await response.json();
    const score = Number(data.predicted_mental_health_score);

    if (!Number.isFinite(score)) {
      throw new Error("The server response did not contain a valid predicted mental health score.");
    }

    document.getElementById("score-value").textContent = score.toFixed(2);
    // The existing UI labels the score as out of 10; clamp the visual bar only.
    const fill = document.getElementById("score-track-fill");
    if (fill) fill.style.width = `${Math.max(0, Math.min(10, score)) * 10}%`;

    showPanel("success");
  } catch (err) {
    const message = err instanceof TypeError
      ? "Could not reach the prediction service. It may be waking up, or the network request may have failed. Please wait a moment and try again."
      : err.message;

    document.getElementById("error-message").textContent = message;
    showPanel("error");
  } finally {
    button.disabled = false;
    buttonLabel.textContent = "Generate prediction";
  }
});

async function describeHttpError(response) {
  try {
    const body = await response.json();
    if (response.status === 422 && Array.isArray(body.detail)) {
      return body.detail
        .map((d) => `${d.loc[d.loc.length - 1]}: ${d.msg}`)
        .join(" | ");
    }
    return `The server returned an error (${response.status}).`;
  } catch {
    return `The server returned an error (${response.status}).`;
  }
}

document.getElementById("try-again-btn").addEventListener("click", () => {
  showPanel("idle");
  form.scrollIntoView({ behavior: "smooth", block: "start" });
});
document.getElementById("retry-btn").addEventListener("click", () => {
  form.requestSubmit();
});
