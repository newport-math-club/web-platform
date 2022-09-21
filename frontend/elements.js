// Navbar
let links = {
	"Home": "index.html",
	"About": "about.html",
	"Contact": "contact.html",
	"Events": "events.html",
	"Resources": "resources.html",
	"KPMT": "kpmt.html",
	"Register": "register.html"
};
class NavBar extends HTMLUListElement {
	constructor () {
		super();
		this.id = "navbar";
		for (const [title, path] of Object.entries(links)) {
			let linkContainer = document.createElement("li");
			let link = document.createElement("a");
			link.href = path;
			link.textContent = title;
			linkContainer.append(link);
			if (path === window.location.pathname.split("/").pop()) {
				link.classList.add("active");
			}
			this.append(linkContainer);
		}
	}
}
customElements.define("nav-bar", NavBar, {extends: "ul"});
// Officer Bios
class OfficerBio extends HTMLElement {
	constructor () {
		super();
		// Get attributes
		let name = this.getAttribute("name");
		let title = this.getAttribute("title");
		let image = this.getAttribute("image");
		// Create bio
		let imageContainer = document.createElement("img");
		imageContainer.src = image;
		imageContainer.alt = name;
		this.append(imageContainer);
		let text = document.createElement("div");
		let nameContainer = document.createElement("h2");
		nameContainer.textContent = name;
		text.append(nameContainer);
		let titleContainer = document.createElement("p");
		titleContainer.textContent = title;
		text.append(titleContainer);
		this.append(text);
	}
}
customElements.define("officer-bio", OfficerBio);