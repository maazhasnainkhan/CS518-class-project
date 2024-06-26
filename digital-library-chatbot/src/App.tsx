import "./App.css";
import { Outlet } from "react-router-dom";

import Header from "./global/header/header";
import Footer from "./global/footer/footer";
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  
  return (
    <div className="App">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
