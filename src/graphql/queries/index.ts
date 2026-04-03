import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      firstName
      lastName
      pid
      phoneNumber
      email
      profileImage
      role
      address {
        lng
        lat
      }
    }
  }
`;

export const GET_COURIERS = gql`
  query GetCouriers {
    couriers {
      id
      firstName
      lastName
      pid
      phoneNumber
      email
      profileImage
      role
      vehicle
      workingDays
      totalBookings
    }
  }
`;

export const GET_COURIER = gql`
  query GetCourier($id: ID!) {
    courier(id: $id) {
      id
      firstName
      lastName
      pid
      phoneNumber
      email
      profileImage
      role
      vehicle
      workingDays
      totalBookings
    }
  }
`;

export const GET_BOOKINGS = gql`
  query GetBookings {
    bookings {
      id
      courierId
      userId
      userName
      day
      startHours
      endHours
    }
  }
`;
