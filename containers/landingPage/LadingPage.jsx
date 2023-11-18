import { Fragment } from "react";
import { TypingText } from "@/components";

function LandingPage() {
  return (
    <Fragment>
      <div className="homepage-left">
        <h1 className="company-name">Welcome To EDUVERSA</h1>
        <h2 className="company-slogan">Chase Your Dream!</h2>
        <div className="typing-text-container">
          <main className="typing-text-main">
            <TypingText />
          </main>
        </div>
      </div>
    </Fragment>
  );
}

export default LandingPage;
