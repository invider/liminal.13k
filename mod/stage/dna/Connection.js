class Connection {

    constructor(st) {
        extend(this, st)
    }

    join(block) {
        this.target = block
    }

    /*
    isFree() {
        return !this.target
    }
    */

    selfWhenFree() {
        if (!this.target) return this
    }

    srcDir() {
        switch(this.dir) {
            case 1: return 3
            case 2: return 4
            case 3: return 1
            case 4: return 2
        }
    }

}
