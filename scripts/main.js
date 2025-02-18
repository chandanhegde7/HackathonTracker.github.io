document.addEventListener("DOMContentLoaded", function () {
    fetch("assets/data/hackathons.yml")
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
        tr.classList.add("hackathon-item");
        tr.setAttribute("data-tags", hackathon.tags.join(" ").toLowerCase());
        hackathonList.appendChild(tr);
    });
    updateCountdowns();
}

function updateCountdowns() {
    function refreshCountdowns() {
        document.querySelectorAll(".countdown").forEach(el => {
            const deadline = new Date(el.getAttribute("data-deadline"));
            const now = new Date();
            const timeDiff = deadline - now;
            
            if (timeDiff < 0) {
                el.innerText = "Registration Closed";
                el.closest("tr").classList.add("expired");
            } else {
                const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
                el.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;
            }
        });
    }
    refreshCountdowns();
    setInterval(refreshCountdowns, 1000);
}

function setupFilters(hackathons) {
    document.querySelectorAll(".filter-btn").forEach(button => {
        button.addEventListener("click", function () {
            const tag = this.getAttribute("data-tag");
            filterHackathons(tag);
        });
    });
}

function filterHackathons(tag) {
    document.querySelectorAll("#hackathons tr").forEach(row => {
        const hackathonTags = row.getAttribute("data-tags");
        if (tag === "all" || hackathonTags.includes(tag.toLowerCase())) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}
