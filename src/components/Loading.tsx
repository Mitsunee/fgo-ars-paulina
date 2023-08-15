import type { WithCC } from "./classcat";
import { cc } from "./classcat";
import styles from "./Loading.module.css";

export function Loading({
  title = "Loading",
  className
}: WithCC<{ title?: string }>) {
  return (
    <section className={cc([className, styles.section])}>
      <h2>{title}</h2>
      <img src="/assets/loading.png" width={150} height={124} alt="loading" />
    </section>
  );
}
