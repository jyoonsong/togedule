import isBefore from 'date-fns/isBefore'
import isAfter from 'date-fns/isAfter'
import startOfDay from 'date-fns/startOfDay'

const dateIsBetween = (start, candidate, end) => {
  const startOfCandidate = startOfDay(candidate)
  const startOfStart = startOfDay(start)
  const startOfEnd = startOfDay(end)

  return (
    (startOfCandidate.getTime() === startOfStart.getTime() || isAfter(startOfCandidate, startOfStart)) &&
    (startOfCandidate.getTime() === startOfEnd.getTime() || isAfter(startOfEnd, startOfCandidate))
  )
}

const timeIsBetween = (start, candidate, end) => {
  const candidateTime = candidate.getHours() * 60 + candidate.getMinutes()
  const startTime = start.getHours() * 60 + start.getMinutes()
  const endTime = end.getHours() * 60 + end.getMinutes()

  return candidateTime >= startTime && candidateTime <= endTime
}

const square = (selectionStart, selectionEnd, dateList) => {
  let selected = []
  if (selectionEnd == null) {
    if (selectionStart) selected = [selectionStart]
  } else if (selectionStart) {
    const dateIsReversed = isBefore(startOfDay(selectionEnd), startOfDay(selectionStart))
    const timeIsReversed = selectionStart.getHours() > selectionEnd.getHours()

    selected = dateList.reduce(
      (acc, dayOfTimes) =>
        acc.concat(
          dayOfTimes.filter(
            t =>
              selectionStart &&
              selectionEnd &&
              dateIsBetween(
                dateIsReversed ? selectionEnd : selectionStart,
                t,
                dateIsReversed ? selectionStart : selectionEnd
              ) &&
              timeIsBetween(
                timeIsReversed ? selectionEnd : selectionStart,
                t,
                timeIsReversed ? selectionStart : selectionEnd
              )
          )
        ),
      []
    )
  }

  return selected
}

export default square