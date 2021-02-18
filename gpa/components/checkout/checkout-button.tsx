function Checkout(reservationId: string | undefined): void {
  if (!reservationId) {
    return;
  }
}

function CheckoutButton({
  reservationId,
}: {
  reservationId: string | undefined;
}): JSX.Element {
  return (
    <button disabled={!reservationId} onClick={() => Checkout(reservationId)}>
      Checkout
    </button>
  );
}

export default CheckoutButton;
