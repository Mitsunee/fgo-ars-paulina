import { changeRoute } from "~/client/router";
import { ButtonRow } from "./ButtonField";

export function NoAccountError() {
  return (
    <section className="primary section">
      <h1>Error: No user Account</h1>
      <p>
        Page could not be displayed as no user account was found. Please create
        an account
      </p>
      <ButtonRow>
        <button
          type="button"
          onClick={() =>
            changeRoute({ path: "create-account", props: { forced: true } })
          }>
          Create Account
        </button>
      </ButtonRow>
    </section>
  );
}
