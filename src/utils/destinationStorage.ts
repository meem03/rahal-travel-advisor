import type { Destination } from '../types/Destination'
import { destinations } from '../data/destinations'

export function getAvailableDestinations(): Destination[] {
  const adminDestinations: Destination[] = JSON.parse(
    localStorage.getItem('adminDestinations') || '[]'
  )

  const deletedDestinationIds: number[] = JSON.parse(
    localStorage.getItem('deletedDestinationIds') || '[]'
  )

  const editedDestinations: Destination[] = JSON.parse(
    localStorage.getItem('editedDestinations') || '[]'
  )

  const baseDestinations = [
    ...destinations,
    ...adminDestinations
  ]

  const filteredDestinations = baseDestinations.filter(
    destination =>
      !deletedDestinationIds.includes(destination.id)
  )

  return filteredDestinations.map(destination => {
    const edited = editedDestinations.find(
      editedDestination => editedDestination.id === destination.id
    )

    return edited || destination
  })
}

export function saveEditedDestination(
  updatedDestination: Destination
) {
  const editedDestinations: Destination[] = JSON.parse(
    localStorage.getItem('editedDestinations') || '[]'
  )

  const existingIndex = editedDestinations.findIndex(
    destination => destination.id === updatedDestination.id
  )

  if (existingIndex >= 0) {
    editedDestinations[existingIndex] = updatedDestination
  } else {
    editedDestinations.push(updatedDestination)
  }

  localStorage.setItem(
    'editedDestinations',
    JSON.stringify(editedDestinations)
  )
}