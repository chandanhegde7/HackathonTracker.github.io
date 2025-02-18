document.addEventListener("DOMContentLoaded", function () {
    fetch("_data/hackathons.yml")
        .then(response => response.text())
        .then(data => {
            const hackathons = jsyaml.load(data);
            displayHackathons(hackathons);
            setupFilters(hackathons);
        });
});

function displayHackathons(hackathons) {
    const hackathonList = document.getElementById("hackathons");
    hackathonList.innerHTML = "";
    
    hackathons.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    
    hackathons.forEach(hackathon => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><a href="${hackathon.link}" target="_blank">${hackathon.name}</a></td>
            <td><span class="deadline" data-deadline="${hackathon.deadline}">${hackathon.deadline}</span></td>
            <td>${hackathon.location}</td>
            <td>${hackathon.tags.join(", ")}</td>
            <td class="countdown" data-deadline="${hackathon.deadline}"></td>
        `;
        
        if (new Date(hackathon.deadline) < new Date()) {
            tr.classList.add("expired");
            tr.querySelector(".countdown").innerText = "Registration Closed";
        }
        
        hackathonList.appendChild(tr);
    });
    updateCountdowns();
}

function updateCountdowns() {
    document.querySelectorAll(".countdown").forEach(el => {
        const deadline = new Date(el.getAttribute("data-deadline"));
        const now = new Date();
        const timeDiff = deadline - now;
        
        if (timeDiff < 0) {
            el.innerText = "Registration Closed";
            el.closest("tr").classList.add("expired");
        } else {
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            el.innerText = `${days} days remaining`;
        }
    });
}

function setupFilters(hackathons) {
    document.querySelectorAll(".filter-btn").forEach(button => {
        button.addEventListener("click", function () {
            const tag = this.getAttribute("data-tag");
            filterHackathons(hackathons, tag);
        });
    });
}

function filterHackathons(hackathons, tag) {
    const filteredHackathons = tag === "all" ? hackathons : hackathons.filter(h => h.tags.includes(tag));
    displayHackathons(filteredHackathons);
}
