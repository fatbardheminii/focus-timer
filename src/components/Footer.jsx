import { FaGithub } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer aria-label="Footer">
      <p>&copy; {currentYear} Fatbardh Emini</p>
      <a
        href="https://github.com/fatbardheminii"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Fatbardh Emini's GitHub profile"
      >
        <FaGithub className="github-icon" aria-hidden="true" />
      </a>
    </footer>
  );
}
