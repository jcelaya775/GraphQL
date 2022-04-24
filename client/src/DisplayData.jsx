import React, { useState } from 'react'
import { useQuery, useLazyQuery, useMutation, gql } from '@apollo/client'

const QUERY_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      age
      username
      nationality
    }
  }
`

const GET_ALL_MOVIES = gql`
  query GetAllMovies {
    movies {
      name
      yearOfPublication
      isInTheaters
    }
  }
`

const GET_MOVIE_BY_NAME = gql`
  query GetAllMovies($name: String!) {
    movie(name: $name) {
      name
      yearOfPublication
      isInTheaters
    }
  }
`

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      name
      id
    }
  }
`

export default function DisplayData() {
  const [movieSearched, setMovieSearched] = useState('')

  // Create User states
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [age, setAge] = useState()
  const [nationality, setNationality] = useState('')

  const { data, loading, refetch, error } = useQuery(QUERY_ALL_USERS)
  const {
    data: moviesData,
    loading: moviesLoading,
    error: moviesError,
  } = useQuery(GET_ALL_MOVIES)
  const [fetchMovie, { data: movieSearchData, error: movieSearchError }] =
    useLazyQuery(GET_MOVIE_BY_NAME)

  const [createUser] = useMutation(CREATE_USER_MUTATION)

  if (loading) {
    return <h1>Data is loading...</h1>
  }
  if (error) {
    console.log(error)
  }
  data && console.log(data)

  moviesData && console.log(moviesData)

  movieSearchData && console.log(movieSearchData)
  if (movieSearchError) {
    console.log(movieSearchError)
  }

  return (
    <div>
      <div>
        <input
          type='text'
          placeholder='Name...'
          onChange={(event) => setName(event.target.value)}
        />
        <input
          type='text'
          placeholder='Username...'
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type='Number'
          placeholder='Age...'
          onChange={(event) => setAge(Number(event.target.value))}
        />
        <input
          type='text'
          placeholder='Nationality...'
          onChange={(event) => setNationality(event.target.value.toUpperCase())}
        />
        <button
          onClick={() => {
            createUser({
              variables: {
                input: {
                  name,
                  username,
                  age,
                  nationality,
                },
              },
            })

            refetch()
          }}
        >
          Create User
        </button>
      </div>
      {data &&
        data.users.map((user, key) => {
          return (
            <div key={key}>
              <h1>Name: {user.name}</h1>
              <h1>Username: {user.username}</h1>
              <h1>Age: {user.age}</h1>
              <h1>Nationality: {user.nationality}</h1>
            </div>
          )
        })}

      {moviesData &&
        moviesData.movies.map((movie, key) => {
          return (
            <div key={key}>
              <h3>Movie name: {movie.name}</h3>
              <h3>Publication Year: {movie.yearOfPublication}</h3>
              <h3>In Theathers: {movie.isInTheaters}</h3>
            </div>
          )
        })}

      <div>
        <input
          type='text'
          placeholder='Interstellar...'
          onChange={(event) => setMovieSearched(event.target.value)}
        />
        <button
          onClick={() => {
            fetchMovie({
              variables: {
                name: movieSearched,
              },
            })
          }}
        >
          Search Movie
        </button>
        <div>
          {movieSearchData && (
            <div>
              <h1>MovieName: {movieSearchData.movie.name}</h1>
              <h1>
                Year Of Publication: {movieSearchData.movie.yearOfPublication}
              </h1>{' '}
            </div>
          )}
          {movieSearchError && <h1> There was an error fetching the data</h1>}
        </div>
      </div>
    </div>
  )
}
