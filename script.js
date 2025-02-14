// =========================
// 01. HEADER & FOOTER LOADING
// =========================
function loadHTML(file, element) {
    if (!element) return;

    fetch(file)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${file}`);
            return response.text();
        })
        .then(data => {
            element.innerHTML = data;
        })
        .catch(error => console.error(`Error loading ${file}:`, error));
}

document.addEventListener("DOMContentLoaded", () => {
    loadHTML('header.html', document.querySelector('header'));
    loadHTML('footer.html', document.querySelector('footer'));
});

// =========================
// 02. ABOUT SECTION - VIDEO PLAYBACK
// =========================
document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("droneVideo");
    if (!video) return;

    video.addEventListener("ended", () => {
        video.currentTime = 0;
        video.play();
    });

    video.addEventListener("loadedmetadata", () => {
        video.currentTime = 0;
    });
});

// =========================
// 03. SMOOTH SCROLLING FUNCTIONALITY
// =========================
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// =========================
// 04. TECHNOLOGY SECTION - VIDEO AUTOPLAY
// =========================
document.addEventListener("DOMContentLoaded", () => {
    const techVideo = document.getElementById("techVideo");
    if (techVideo) techVideo.play();
});

// =========================
// 05. PRODUCTS SECTION - DYNAMIC PRODUCT RENDERING
// =========================
document.addEventListener("DOMContentLoaded", () => {
    const products = [
        { name: "Hoopoe Drone", description: "Advanced reconnaissance.", logo: "assets/logos/hoopoe.webp", video: "assets/videos/drone-1-hoopoe.mp4" },
        { name: "Pigeon Drone", description: "Urban and rural delivery.", logo: "assets/logos/pigeon.webp", video: "assets/videos/drone-2-pigeon.mp4" },
        { name: "Crow Drone", description: "Environmental monitoring.", logo: "assets/logos/crow.webp", video: "assets/videos/drone-3-crow.mp4" },
        { name: "Eagle Drone", description: "Long-range industrial use.", logo: "assets/logos/eagle.webp", video: "assets/videos/drone-4-eagle.mp4" },
        { name: "Bee Drone", description: "Swarm coordination.", logo: "assets/logos/bee.webp", video: "assets/videos/drone-5-bee.mp4" },
        { name: "Sparrow Drone", description: "Detailed inspections.", logo: "assets/logos/sparrow.webp", video: "assets/videos/drone-6-sparrow.mp4" },
        { name: "Phoenix Drone", description: "Resilient operations.", logo: "assets/logos/pheonix.webp", video: "assets/videos/drone-7-phoenix.mp4" },
        { name: "Goshawk Drone", description: "Heavy load transport.", logo: "assets/logos/goshawk.webp", video: "assets/videos/drone-8-goshawk.mp4" },
        { name: "Falcon Drone", description: "High-speed tracking.", logo: "assets/logos/falcon.webp", video: "assets/videos/drone-9-falcon.mp4" },
        { name: "Owl Drone", description: "Night surveillance.", logo: "assets/logos/owl.webp", video: "assets/videos/drone-10-owl.mp4" }
    ];

    const productGrid = document.querySelector(".product-grid");
    if (!productGrid) return;

    products.forEach((product, index) => {
        productGrid.innerHTML += `
            <div class="product-item" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <h3>${product.name}</h3>
                            <img src="${product.logo}" alt="${product.name} Logo">
                        </div>
                        <div class="flip-card-back">
                            <video class="drone-video" muted loop>
                                <source src="${product.video}" type="video/mp4">
                            </video>
                            <p>${product.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
});

// =========================
// 06. SERVICES SECTION - CATEGORY SWITCHING
// =========================
function showServiceCategory(categoryId, clickedButton) {
    // Remove 'active' class from all service categories
    document.querySelectorAll('.services-category').forEach(category => {
        category.classList.remove('active');
    });

    // Add 'active' class to the selected category
    document.getElementById(categoryId).classList.add('active');

    // Remove 'active' class from all buttons
    document.querySelectorAll('.services-tabs .tab').forEach(button => {
        button.classList.remove('active');
    });

    // Add 'active' class to the clicked button
    clickedButton.classList.add('active');
}

// =========================
// 07. TESTIMONIALS SECTION
// =========================
const testimonials = [
    { text: "MADS drones transformed our security surveillance!", author: "Sarah Thompson", role: "Security Director" },
    { text: "Their mapping solutions significantly improved our planning.", author: "Michael Lee", role: "Chief Engineer" }
];

let currentTestimonial = 0;
function updateTestimonial(index) {
    document.querySelector(".testimonial-text").textContent = testimonials[index].text;
    document.querySelector(".testimonial-author").textContent = testimonials[index].author;
    document.querySelector(".testimonial-role").textContent = testimonials[index].role;
}

document.addEventListener("DOMContentLoaded", () => {
    updateTestimonial(currentTestimonial);
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        updateTestimonial(currentTestimonial);
    }, 5000);
});

// =========================
// 08. FAQ SECTION - DYNAMIC RENDERING
// =========================
const faqData = [
    { question: "What is the range of the Hoopoe drone?", answer: "Up to 10 km." },
    { question: "What is the max payload for Pigeon drone?", answer: "5 kg for light deliveries." }
];

function renderFAQ() {
    const faqGrid = document.querySelector('.faq-grid');
    if (!faqGrid) return;

    faqGrid.innerHTML = faqData.map((faq, index) => `
        <div class="faq-item">
            <h3 class="faq-question" data-index="${index}">${faq.question}</h3>
            <p class="faq-answer">${faq.answer}</p>
        </div>
    `).join('');

    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            question.nextElementSibling.classList.toggle("active");
        });
    });
}

document.addEventListener("DOMContentLoaded", renderFAQ);

// =========================
// 09. CAREERS SECTION - JOB LISTING
// =========================

const careers = [
    {
        title: "CAD and Materials Specialist",
        department: "Mechanical Engineering",
        skills: [
            "Proficiency in CAD software (e.g., SolidWorks, AutoCAD)",
            "Knowledge of material science and structural analysis",
            "Experience with prototyping and testing methods"
        ],
        responsibilities: [
            "Develop detailed CAD models for drone prototypes",
            "Conduct material testing and structural analysis",
            "Research and recommend optimal materials for drone components",
            "Collaborate with other engineers to refine designs"
        ],
        goal: "Produce 1-10 CAD designs and a detailed 5-page document per prototype recommending the best materials for each drone."
    },
    {
        title: "Transportation Drone Specialist",
        department: "Mechanical Engineering",
        skills: [
            "Understanding of payload dynamics and aerodynamics",
            "Knowledge of safety mechanisms and efficiency in drone systems",
            "Ability to design and test mechanical systems"
        ],
        responsibilities: [
            "Research payload capacities and transportation requirements",
            "Design and test a drone system specifically for transportation purposes",
            "Analyse efficiency and safety mechanisms for transport drones",
            "Provide detailed recommendations for enhancing transportation drone capabilities"
        ],
        goal: "Produce a detailed 5-page document on transportation drone capabilities and assist in building one functional transportation drone prototype."
    },
    {
        title: "ROS Developer",
        department: "Computer Engineering / Software Engineering / Computer Science",
        skills: [
            "Proficiency in C++ and Python programming",
            "Experience with ROS frameworks and tools (e.g., rviz, Gazebo)",
            "Knowledge of hardware integration and communication protocols"
        ],
        responsibilities: [
            "Create and test ROS nodes for navigation and communication",
            "Integrate hardware components using ROS frameworks",
            "Debug and troubleshoot ROS-based drone systems",
            "Optimize ROS performance for multi-agent systems"
        ],
        goal: "Deliver fully functional ROS nodes for drone operations with a comprehensive user guide."
    },
    {
        title: "User Interface Specialist",
        department: "Computer Engineering / Software Engineering / Computer Science",
        skills: [
            "Proficiency in web and mobile development frameworks (e.g., React, Flutter)",
            "Strong understanding of UI/UX principles",
            "Ability to integrate interfaces with backend systems"
        ],
        responsibilities: [
            "Design and implement web and mobile user interfaces",
            "Integrate UI elements with drone control systems",
            "Test and refine user experiences based on feedback",
            "Ensure compatibility across devices and platforms"
        ],
        goal: "Create a fully functional user interface for drone operation, including web and mobile integration."
    },
    {
        title: "Drone Electrical Systems Engineer",
        department: "Electrical Engineering",
        skills: [
            "Knowledge of power systems and PCB design tools (e.g., Altium, Eagle)",
            "Proficiency in sensor and motor controller integration",
            "Understanding of electrical testing and troubleshooting techniques"
        ],
        responsibilities: [
            "Develop and test power distribution and management systems",
            "Create and troubleshoot PCB layouts for drones",
            "Integrate sensors and motor controllers",
            "Ensure the reliability and safety of electrical components"
        ],
        goal: "Deliver a fully operational electrical system for drone prototypes with detailed schematics."
    },
    {
        title: "Communication Drone Specialist",
        department: "Electrical Engineering",
        skills: [
            "Knowledge of communication protocols and systems",
            "Experience in signal relay and addressing systems",
            "Proficiency in integrating communication hardware with drones"
        ],
        responsibilities: [
            "Research and design a communication system tailored for a drone prototype",
            "Test and evaluate addressing and signal relay capabilities",
            "Ensure compatibility with existing communication networks",
            "Collaborate with other teams to integrate the communication system into a functional drone"
        ],
        goal: "Produce a 5-page document on the communication system’s design and capabilities, and assist in building one communication drone prototype."
    },
    {
        title: "Shelter Drone Specialist",
        department: "Civil Engineering",
        skills: [
            "Understanding of structural analysis and construction methods",
            "Knowledge of material properties and selection",
            "Ability to design and prototype shelter systems"
        ],
        responsibilities: [
            "Analyse structural requirements for a drone prototype designed for shelter purposes",
            "Research materials and construction methods that drones can efficiently utilize",
            "Collaborate in designing and testing a shelter drone prototype",
            "Ensure compliance with safety and durability standards for the shelter system"
        ],
        goal: "Produce a 5-page document detailing shelter drone capabilities and assist in building one functional shelter drone prototype."
    },
    {
        title: "Nutrition Drone Specialist",
        department: "Agricultural Engineering",
        skills: [
            "Knowledge of nutrient delivery systems and land assessment",
            "Understanding of drone applications in agriculture",
            "Proficiency in data collection and analysis"
        ],
        responsibilities: [
            "Study drone applications for nutrient delivery and land assessment in agricultural contexts",
            "Research drone use in cattle monitoring and efficient nutrient distribution",
            "Assist in designing and testing a drone prototype for agricultural nutrition purposes",
            "Provide data-driven recommendations for agricultural improvements"
        ],
        goal: "Produce a 5-page document on agricultural drone applications and assist in building one functional nutrition drone prototype."
    },
    {
        title: "Accounting and Documentation Specialist",
        department: "Business",
        skills: [
            "Proficiency in financial tracking tools and software",
            "Knowledge of budgeting, forecasting, and accounting practices",
            "Strong organizational and documentation skills",
            "Familiarity with financial reporting standards and compliance"
        ],
        responsibilities: [
            "Develop and maintain a comprehensive financial tracking and documentation system",
            "Prepare accurate budgets, forecasts, and financial reports for projects",
            "Monitor and analyze project expenses to ensure adherence to budgets",
            "Document all financial processes and provide detailed reporting on financial structures"
        ],
        goal: "Deliver a comprehensive financial report and documentation system outlining budgeting, forecasting, and expense tracking for company operations."
    },
    {
        title: "Marketing and Outreach Specialist",
        department: "Business",
        skills: [
            "Strong communication and presentation skills",
            "Proficiency in market research tools",
            "Knowledge of digital marketing and outreach strategies",
            "Ability to analyze marketing performance data effectively"
        ],
        responsibilities: [
            "Conduct thorough market research to identify growth opportunities and trends",
            "Develop and execute promotional content and outreach strategies tailored to specific audiences",
            "Engage with potential clients and partners to build lasting relationships",
            "Monitor and analyze marketing performance metrics, creating actionable reports",
            "Collaborate with other departments to align marketing efforts with company goals"
        ],
        goal: "Produce a 5-page document summarizing marketing strategies, performance analysis, and outreach outcomes for each of the 1-10 drone prototypes."
    }
];

// Function to render career cards
// Function to render career cards
function renderCareers() {
    const careersGrid = document.querySelector('.career-grid');
    if (!careersGrid) return;

    careersGrid.innerHTML = careers.map((career, index) => `
        <div class="career-item">
            <div class="career-card-inner">
                <!-- FRONT OF THE CARD -->
                <div class="career-card-front">
                    <h3>${career.title}</h3>
                    <button class="details-btn" onclick="flipCard(${index})">Details</button>
                </div>

                <!-- BACK OF THE CARD -->
                <div class="career-card-back">
                    <div class="close-slip" onclick="flipCard(${index})">×</div>  <!-- Silver Slip -->
                    <h4>${career.title}</h4>
                    <p><strong>Department:</strong> ${career.department}</p>
                    <h5>Required Skills:</h5>
                    <ul>${career.skills.map(skill => `<li>${skill}</li>`).join('')}</ul>
                    <h5>Responsibilities:</h5>
                    <ul>${career.responsibilities.map(resp => `<li>${resp}</li>`).join('')}</ul>
                    <h5>Final Goal:</h5>
                    <p>${career.goal}</p>
                    <button class="apply-btn" onclick="openJobModal('${career.title}')">Apply</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Flip the card when clicking "Details" or "Silver Slip"
function flipCard(index) {
    const cards = document.querySelectorAll('.career-card-inner');
    if (cards[index]) {
        cards[index].classList.toggle('flipped');
    }
}

// Function to open job application modal
function openJobModal(jobTitle) {
    const modal = document.getElementById("jobModal");
    document.getElementById("modalJobTitle").innerText = jobTitle;
    modal.style.display = "flex";
}

// Function to close job application modal
function closeJobModal() {
    document.getElementById("jobModal").style.display = "none";
}

// Close modal when clicking outside content
window.onclick = function (event) {
    const modal = document.getElementById("jobModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

// Ensure renderCareers is executed
document.addEventListener("DOMContentLoaded", renderCareers);

// =========================
// 10. FOOTER - COPYRIGHT YEAR
// =========================
document.addEventListener("DOMContentLoaded", () => {
    const yearElement = document.querySelector("#current-year");
    if (yearElement) yearElement.textContent = new Date().getFullYear();
});
