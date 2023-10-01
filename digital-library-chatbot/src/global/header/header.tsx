import { Link } from "react-router-dom";

function Header() {
  return (
    <div>
      <ul>
        <li>
          <Link to={`/login`}>Login</Link>
        </li>
        <li>
        <Link to={`/sign-up`}>Sign up</Link>
        </li>
      </ul>

      
    </div>
  );
}

export default Header;
