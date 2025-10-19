export function calculateAge(dobString : string) : number  {

  const dob = new Date(dobString);
  const today = new Date();

  let age =  today.getFullYear() - dob.getFullYear();

  const monthDiff =  today.getMonth() - dob.getMonth();

  if ( monthDiff < 0 || ( monthDiff == 0 && today.getDate() - dob.getDate() ) ){
    age--;
  }

  return age
}