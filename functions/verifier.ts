function verify(input: {[key:string]:string;}[], mined: {[key:string]:string;}[]) {
    return mined.filter((e, i) => {
        return Object.keys(e).filter((key) => {
            return e[key] !== input[i][key];
        }).length > 0;
    }); 
}

export { verify };