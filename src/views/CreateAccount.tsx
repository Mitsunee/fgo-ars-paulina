import {
  createAccount,
  getAccountId,
  saveAccount,
  selectAccount
} from "~/client/account";
import { returnHome } from "~/client/router";
import { ButtonField } from "~/components/ButtonField";
import { InputRadio } from "~/components/InputRadio";

interface ViewProps {
  forced?: true;
}

const handleSubmit: React.ComponentProps<"form">["onSubmit"] = event => {
  event.preventDefault();
  const { elements } = event.currentTarget;

  // get name
  const nameEl = elements.namedItem("accountname") as React.ElementRef<"input">;
  const name = nameEl.checkValidity() && nameEl.value;
  if (!name) return;

  // get fc
  const fcEl = elements.namedItem("friendcode") as React.ElementRef<"input">;
  const fc = fcEl.checkValidity() && fcEl.value;
  if (!fc) return;

  // get region
  const regionEls = elements.namedItem("region") as RadioNodeList;
  const region = regionEls.value as "" | "na" | "jp";
  if (!region) return;

  const newAccount = createAccount(name, region, fc);
  const accountId = getAccountId(newAccount);
  saveAccount(newAccount);
  selectAccount(accountId);
  returnHome();
};

export function CreateAccountView({ forced }: ViewProps) {
  return (
    <section aria-labelledby="title" className="section">
      <h1 id="title">Create Account</h1>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Name:</legend>
          <input
            type="text"
            name="accountname"
            placeholder="Account Name"
            title="Name of the Account"
            required
            aria-required
            minLength={1}
          />
        </fieldset>
        <fieldset>
          <legend>Friendcode:</legend>
          <input
            type="text"
            name="friendcode"
            placeholder="0000-0000-0000"
            pattern="[0-9]{4}-[0-9]{4}-[0-9]{4}"
            title="Friendcode in Format 0000-0000-0000"
            required
            aria-required
            minLength={14}
            maxLength={14}
          />
        </fieldset>
        <fieldset>
          <legend>Region:</legend>
          <InputRadio name="region" value="na" defaultChecked>
            EN
          </InputRadio>
          <InputRadio name="region" value="jp">
            JP
          </InputRadio>
        </fieldset>
        <ButtonField>
          <button type="submit" className="primary">
            Create Account
          </button>
          {!forced && (
            <button type="button" onClick={() => returnHome()}>
              Cancel
            </button>
          )}
        </ButtonField>
      </form>
    </section>
  );
}
