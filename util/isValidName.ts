function isValidName(name: string): boolean {
    if (name.length > 18 || !/^[a-zA-Z]+$/.test(name)) {
      return false
    } else {return true};
  }

export default isValidName;