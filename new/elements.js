// Navbar
let links = {
	"Home": "index.html"
};
class NavBar extends HTMLUListElement {
	constructor () {
		super();
		this.id = "navbar";
		let stylesheet = document.createElement("link");
		stylesheet.rel = "stylesheet";
		stylesheet.href = "navbar.css";
		this.append(stylesheet);
		for (const [title, path] of Object.entries(links)) {
			let linkContainer = document.createElement("li");
			let link = document.createElement("a");
			link.href = path;
			link.textContent = title;
			linkContainer.append(link);
			this.append(linkContainer);
		}
	}
}
customElements.define("nav-bar", NavBar, {extends: "ul"});