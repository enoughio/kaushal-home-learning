export function EmailFormate(email: string) {

     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) 
          return false;
        return true;
}


