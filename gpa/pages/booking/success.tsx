import { useRouter } from "next/router";

function SuccessPage(): JSX.Element {
  const router = useRouter();

  return (
    <div>
      <h2>Reservation successful!</h2>
      <button onClick={() => router.push("/")}>Return to index page</button>
    </div>
  );
}

export default SuccessPage;
