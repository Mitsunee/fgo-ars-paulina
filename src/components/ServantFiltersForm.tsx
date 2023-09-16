import type { Dispatch } from "preact/hooks";
import type { FiltersAction, FiltersState } from "~/client/servantsFilter";
import { ArrowButton } from "./ArrowButton";
import { ButtonField } from "./ButtonField";
import { ClassSelector } from "./ClassSelector";
import { InputRadio } from "./InputRadio";
import { cc, type ElementProps, type WithCC } from "./jsx";

interface ServantFiltersFormProps extends WithCC<ElementProps<"form">> {
  query: string;
  setQuery: Dispatch<string>;
  filters: FiltersState;
  setFilters: Dispatch<FiltersAction>;
}

export function ServantFiltersForm({
  children,
  className,
  query,
  setQuery,
  filters,
  setFilters,
  ...props
}: ServantFiltersFormProps) {
  return (
    <form
      className={cc(className)}
      {...props}
      onSubmit={ev => ev.preventDefault()}>
      <ButtonField>
        <input
          type="search"
          name="servant-search"
          value={query}
          onInput={ev => setQuery(ev.currentTarget.value)}
          placeholder="Search"
        />
        <ArrowButton
          state={filters.menu}
          side="right"
          set={value => setFilters({ type: "menu", value })}>
          Filters
        </ArrowButton>
      </ButtonField>
      {filters.menu && (
        <>
          <ClassSelector
            state={filters.classes}
            set={value => setFilters({ type: "classes", value })}
          />
          <fieldset>
            <legend>Rarity</legend>
            <InputRadio
              name="rarity"
              value="0"
              onClick={() => setFilters({ type: "rarity", value: null })}
              defaultChecked={filters.rarity === null}>
              *
            </InputRadio>
            <InputRadio
              name="rarity"
              value="1"
              onClick={() => setFilters({ type: "rarity", value: 1 })}
              defaultChecked={filters.rarity === 1}>
              1
            </InputRadio>
            <InputRadio
              name="rarity"
              value="2"
              onClick={() => setFilters({ type: "rarity", value: 2 })}
              defaultChecked={filters.rarity === 2}>
              2
            </InputRadio>
            <InputRadio
              name="rarity"
              value="3"
              onClick={() => setFilters({ type: "rarity", value: 3 })}
              defaultChecked={filters.rarity === 3}>
              3
            </InputRadio>
            <InputRadio
              name="rarity"
              value="4"
              onClick={() => setFilters({ type: "rarity", value: 4 })}
              defaultChecked={filters.rarity === 4}>
              4
            </InputRadio>
            <InputRadio
              name="rarity"
              value="5"
              onClick={() => setFilters({ type: "rarity", value: 5 })}
              defaultChecked={filters.rarity === 5}>
              5
            </InputRadio>
          </fieldset>
          <fieldset>
            <legend>Region</legend>
            <InputRadio
              name="region"
              value="na"
              onClick={() => setFilters({ type: "naOnly", value: true })}
              defaultChecked={filters.naOnly}>
              EN
            </InputRadio>
            <InputRadio
              name="region"
              value="jp"
              onClick={() => setFilters({ type: "naOnly", value: false })}
              defaultChecked={!filters.naOnly}>
              JP
            </InputRadio>
          </fieldset>
        </>
      )}
      {children}
    </form>
  );
}
