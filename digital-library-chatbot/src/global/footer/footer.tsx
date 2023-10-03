import { Link } from "react-router-dom";


function Footer(){
    return (
<footer className="page-footer font-small blue pt-4">
    

    <div className="footer-copyright text-center py-3">© 2023 Copyright:
        <Link to={'https://maazhasnainkhan.github.io'}> Maaz H Khan</Link>
    </div>

</footer>

      );
}

export default Footer;