


const CCSUlties = {
    parseUIFile: (file) => {
        let json = ccs.load(file);
        return json.node;
    }
}
