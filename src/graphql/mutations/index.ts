import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!, $role: String!) {
    login(email: $email, password: $password, role: $role) {
      token
      user {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

export const REGISTER_ADMIN = gql`
  mutation RegisterAdmin($input: AdminInput!) {
    registerAdmin(input: $input) {
      id
      email
      role
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($input: UserInput!) {
    registerUser(input: $input) {
      id
      email
      role
    }
  }
`;

export const REGISTER_COURIER = gql`
  mutation RegisterCourier($input: CourierInput!) {
    registerCourier(input: $input) {
      id
      email
      role
    }
  }
`;

export const UPDATE_COURIER = gql`
  mutation UpdateCourier($id: ID!, $input: CourierUpdateInput!) {
    updateCourier(id: $id, input: $input) {
      id
      workingDays
    }
  }
`;

export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: BookingInput!) {
    createBooking(input: $input) {
      id
      courierId
      userId
      day
      startHours
      endHours
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const DELETE_COURIER = gql`
  mutation DeleteCourier($id: ID!) {
    deleteCourier(id: $id)
  }
`;
