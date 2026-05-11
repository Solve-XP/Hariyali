import "./NotFound.css";
import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__code">404</div>
      <h2 className="not-found__title">Page Not Found</h2>
      <p className="not-found__sub">The page you are looking for doesn't exist.</p>
      <Link to="/"><Button variant="primary">Go Home</Button></Link>
    </div>
  );
}
