import supabase from "./supabase";
import { getToday } from "../utils/helpers";
import { PAGE_SIZE } from "../constants/constant";

export const fetchBookings = async ({ filter, sortBy, page }) => {
  let query = supabase
    .from("bookings")
    .select(
      "id, created_at, start_date, end_date, number_nights, number_guests, status, total_price,  cabins(name),guest(full_name, email)",
      { count: "exact" }
    );

  //*  A) Filter
  if (filter) {
    query[filter.method || "eq"](filter.field, filter.value);
  }

  //* B) Sort By
  if (sortBy) {
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });
  }

  //* C) Pagination
  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.log(error);
    throw new Error("Bookings could not be fetched");
  }

  return { data, count };
};

export const getBooking = async (id) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guest(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
};

//* Returns all bookings  created after the given date. Useful to get bookings created in the last num days
//! Date = ISOString
export const getBookingsAfterDate = async (date) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, total_price, extra")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
};

//* Returns all stays created after the given date
export const getStaysAfterDate = async (date) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guest(full_name)")
    .gte("start_date", date)
    .lte("start_date", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
};

//! Activity = check in or a check out today
export const getStaysTodayActivity = async () => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guest(full_name, nationality, country)")
    .or(
      `and(status.eq.unconfirmed,start_date.eq.${getToday()}),and(status.eq.checked-in,end_date.eq.${getToday()})`
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.start_date))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
};

export const updateBooking = async (id, obj) => {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
};

export const deleteBooking = async (id) => {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
};
