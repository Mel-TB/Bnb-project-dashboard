import Pagination from "../../ui/pagination/Pagination.styles";
import Spinner from "../../ui/spinner/Spinner.styles";
import { useGuests } from "features/guests/useGuests";
import GuestListItem from "./GuestListItem";

import { List, PaginationContainer, StyledGuestList } from "./GuestList.styles";

const GuestList = ({ onClick }) => {
  const { isLoading, guests, count } = useGuests();

  if (isLoading) return <Spinner />;
  if (count === undefined) return null;
  if (count === 0) return <p>No guests found...</p>;

  return (
    <StyledGuestList>
      <List>
        {guests.map((guest) => (
          <GuestListItem
            key={guest.id}
            guest={guest}
            // For case where GuestList was used without the onClick function
            onClick={onClick ? onClick : () => {}}
          />
        ))}
      </List>

      <PaginationContainer>
        <Pagination count={count} />
      </PaginationContainer>
    </StyledGuestList>
  );
};

export default GuestList;
