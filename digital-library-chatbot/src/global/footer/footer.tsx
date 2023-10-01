import { Link } from "react-router-dom";

function Footer(){
    return (
        <div>
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
        </div>
      );
}

export default Footer;