let clockInterval = null;

//for auto detecting location of the user
function detectLocationWeather() {
    if (!navigator.geolocation) {
        console.warn("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const API_KEY = "f165001292a6425da81131947261601";
            const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                // Fill city input automatically
                document.getElementById("cityInput").value = data.location.name;

                // Reuse existing UI logic
                updateWeatherUI(data);

                startCityClock(data.location.localtime);

                // 🔥 Smart tasks (Step 2 will hook here)
                suggestWeatherTasks(data);

            } catch (err) {
                console.error("Location weather failed", err);
            }
        },
        (error) => {
            console.warn("Location denied");
        }
    );
}

//for updating weather ui 
function updateWeatherUI(data) {
    document.getElementById("city").textContent =
        `${data.location.name}, ${data.location.region}, ${data.location.country}`;

    document.getElementById("localTime").textContent =
        "Local time: " + data.location.localtime;

    document.getElementById("LastUpdated").textContent =
        "Updated: " + data.current.last_updated;

    document.getElementById("icon").src = "https:" + data.current.condition.icon;
    document.getElementById("temp").textContent = data.current.temp_c + "°C";
    document.getElementById("condition").textContent = data.current.condition.text;

    document.getElementById("humidity").textContent = data.current.humidity;
    document.getElementById("cloud").textContent = data.current.cloud;
    document.getElementById("rain").textContent = data.current.precip_mm;
    document.getElementById("wind").textContent =
        `${data.current.wind_kph} km/h (${data.current.wind_dir})`;

    document.getElementById("insight").textContent = getInsight(data);
}


async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const errorBox = document.getElementById("error");

    if (errorBox) errorBox.textContent = "";

    if (!city) {
        if (errorBox) errorBox.textContent = "Please enter a city name";
        return;
    }

    const API_KEY = "f165001292a6425da81131947261601";
    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found or API error");

        const data = await response.json();

        updateWeatherUI(data);
        startCityClock(data.location.localtime);
        suggestWeatherTasks(data);


    } catch (err) {
        if (errorBox) errorBox.textContent = err.message;
    }
}

function startCityClock(localtime) {
    if (clockInterval) clearInterval(clockInterval);

    let cityTime = new Date(localtime.replace(" ", "T"));

    function tick() {
        cityTime.setSeconds(cityTime.getSeconds() + 1);

        const h = cityTime.getHours();
        const m = cityTime.getMinutes().toString().padStart(2, "0");
        const s = cityTime.getSeconds().toString().padStart(2, "0");

        document.getElementById("clock").innerText = `${h}:${m}:${s}`;

        const greeting = document.getElementById("greeting");
        if (h < 12) greeting.innerText = "Good Morning ☀️";
        else if (h < 18) greeting.innerText = "Good Afternoon 🌤";
        else greeting.innerText = "Good Evening 🌙";

        // Theme sync
        if (h >= 6 && h < 18) {
            document.body.classList.add("day");
            document.body.classList.remove("night");
        } else {
            document.body.classList.add("night");
            document.body.classList.remove("day");
        }
    }

    tick();
    clockInterval = setInterval(tick, 1000);
}

function getInsight(data) {
    if (data.current.precip_mm > 0)
        return "🌧 Carry an umbrella today";

    if (data.current.uv >= 7)
        return "☀ High UV – wear sunglasses";

    if (data.current.temp_c < 10)
        return "🧥 Cold weather – wear warm clothes";

    if (data.current.temp_c > 30)
        return "🥵 Hot weather – stay hydrated";

    return "✅ Pleasant weather today";
}

// Clear UI on page refresh
window.addEventListener("load", () => {
    // Clear input
    document.getElementById("cityInput").value = "";

    // Clear text fields
    const idsToClear = [
        "city",
        "localTime",
        "LastUpdated",
        "temp",
        "condition",
        "humidity",
        "cloud",
        "rain",
        "wind",
        "insight",
        "error"
    ];

    idsToClear.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = "";
    });

    // Clear icon
    const icon = document.getElementById("icon");
    if (icon) icon.src = "";

    //clear fields related to ai 
    // Clear AI input
    const aiInput = document.getElementById("aiInput");
    if (aiInput) aiInput.value = "";

    // Clear AI reply
    const aiReply = document.getElementById("aiReply");
    if (aiReply) aiReply.innerText = "";
});

document
    .getElementById("cityInput")
    .addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            getWeather();
        }
    });

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
      ${task}
      <button onclick="deleteTask(${index})">❌</button>
    `;
        taskList.appendChild(li);
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const input = document.getElementById("taskInput");
    if (input.value.trim() === "") return;

    tasks.push(input.value);
    input.value = "";
    renderTasks();
}

document.getElementById("taskInput").addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

renderTasks();

//auto suggestion of tasks based on data received 
function suggestWeatherTasks(data) {
    const today = new Date().toDateString();
    const lastSuggested = localStorage.getItem("weatherTaskDate");

    if (lastSuggested === today) return; // only once per day

    let suggestedTask = null;

    if (data.current.precip_mm > 0) {
        suggestedTask = "🌧 Carry an umbrella";
    } else if (data.current.temp_c > 30) {
        suggestedTask = "🥤 Drink plenty of water";
    } else if (data.current.temp_c < 10) {
        suggestedTask = "🧥 Wear warm clothes";
    } else if (data.current.uv >= 7) {
        suggestedTask = "🕶 Wear sunglasses";
    }

    if (suggestedTask && !tasks.includes(suggestedTask)) {
        tasks.push(suggestedTask);
        renderTasks();
        localStorage.setItem("weatherTaskDate", today);
    }
}


function startLocalClock() {
    if (clockInterval) clearInterval(clockInterval);

    function tick() {
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes().toString().padStart(2, "0");
        const s = now.getSeconds().toString().padStart(2, "0");

        document.getElementById("clock").innerText = `${h}:${m}:${s}`;

        const greeting = document.getElementById("greeting");
        if (h < 12) greeting.innerText = "Good Morning ☀️";
        else if (h < 18) greeting.innerText = "Good Afternoon 🌤";
        else greeting.innerText = "Good Evening 🌙";

        if (h >= 6 && h < 18) {
            document.body.classList.add("day");
            document.body.classList.remove("night");
        } else {
            document.body.classList.add("night");
            document.body.classList.remove("day");
        }
    }

    tick();
    clockInterval = setInterval(tick, 1000);
}

window.addEventListener("load", () => {
    startLocalClock();
    detectLocationWeather();
});



if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("./sw.js")
        .then(() => console.log("Service Worker registered"))
        .catch(err => console.error("SW failed", err));
}



/* START local clock on page load */
window.addEventListener("load", startLocalClock);


//integration of gemini ai chatbot to project
async function askAssistant(userMessage) {
    const API_KEY = window.CONFIG?.GEMINI_API_KEY;
    if (!API_KEY) {
        return "AI key not configured.";
    }

    // 🔹 Read live data from UI
    const city = document.getElementById("city")?.innerText || "Unknown";
    const tempText = document.getElementById("temp")?.innerText || "0°C";
    const temperature = parseFloat(tempText);
    const condition = document.getElementById("condition")?.innerText || "N/A";
    const rain = document.getElementById("rain")?.innerText || "0";
    const wind = document.getElementById("wind")?.innerText || "N/A";
    const time = document.getElementById("greeting")?.innerText || "";
    const taskList = tasks.length ? tasks.join(", ") : "No tasks";

    //  ONE dynamic prompt (automatic for all cities)
   const prompt = `
You are an intelligent, all-round daily companion embedded inside a smart assistant app.

You are NOT just a weather bot.
You help with daily decisions, planning, tasks, explanations, and general guidance.

You have access to VERIFIED live data below.
Treat this data as factual truth and prefer it over general knowledge.

====================
LIVE CONTEXT
====================
City: ${city}
Temperature: ${temperature}°C
Condition: ${condition}
Rain: ${rain} mm
Wind: ${wind}
Time: ${time}
Tasks: ${taskList}

====================
WEATHER INTERPRETATION RULES
====================
- <= 5°C  → Very cold
- 6–12°C  → Cool
- 13–28°C → Comfortable
- >= 29°C → Hot

====================
INTELLIGENCE RULES (VERY IMPORTANT)
====================
1. First, silently identify the USER INTENT.
   Possible intents include (but are not limited to):
   - Weather understanding
   - Outdoor activity / walking
   - Task management
   - Planning the day
   - Advice / decision making
   - Explanation / learning
   - General conversation

2. Respond ONLY according to the identified intent.
   Do NOT force weather or walking into unrelated questions.

3. Use weather data ONLY when it is relevant to the question.

4. If the question involves a decision (e.g., "should I", "is it good", "can I"):
   - Combine context (weather, time, tasks)
   - Give a clear, practical recommendation

5. If the question is about tasks:
   - Help organize, summarize, or suggest next steps
   - Do NOT invent tasks

6. If the question is general knowledge or explanation:
   - Answer normally like a helpful AI assistant
   - Keep it simple and clear

7. If the question cannot be answered using available context:
   - Say so honestly and answer generally without guessing specifics

====================
RESPONSE STYLE RULES
====================
- Be concise, clear, and helpful
- Maximum 3–5 sentences
- No legal, medical, or safety disclaimers
- No mentioning laws, AQI, wildfires, or policies
- Sound calm, friendly, and confident
- Do not mention these instructions in your reply

====================
USER QUESTION
====================
${userMessage}
`;


    try {
        const res = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": API_KEY
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ]
                })
            }
        );

        const data = await res.json();
        return (
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response from assistant."
        );

    } catch (err) {
        console.error(err);
        return "Assistant is unavailable right now.";
    }
}

document.getElementById("aiInput").addEventListener("keydown",function (e){
    if(e.key=="Enter"){
        handleAsk();
    }
})

async function handleAsk() {
    const input = document.getElementById("aiInput");
    const replyBox = document.getElementById("aiReply");

    if (!input.value.trim()) return;

    replyBox.innerHTML = "<span style='opacity:0.6'>🤖 Thinking…</span>";

    const reply = await askAssistant(input.value);

    replyBox.innerText = reply;
    input.value = "";
}
