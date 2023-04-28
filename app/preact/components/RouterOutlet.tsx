import { ComponentChildren } from "preact";
import { useRouter } from "..";

interface RouterProps {
  children?: ComponentChildren;
}

export function RouterOutlet(props: RouterProps) {
  const { stack } = useRouter();

  return (
    <>
      {props.children && <div class="page">{props.children}</div>}
      {stack.value.map(({ component }, index) => (
        <div class="page" key={index}>
          {component}
        </div>
      ))}
    </>
  );
}
