import { FaGithub } from "react-icons/fa";

export default function Footer () {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer>
        <p>&copy; {currentYear} Fatbardh Emini</p>
        <a
          href="https://github.com/fatbardheminii"
          target="_blank"
          aria-label="Visit Fatbardh Emini's Github profile"
        >
          <FaGithub className="github-icon"></FaGithub>
        </a>
      </footer>
    </>
  );
};
