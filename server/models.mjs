export default class Player {
    constructor(connId, name, level = 1, gearBonus = 0){
        this.connId = connId
        this.name = name
        this.level = level
        this.gearBonus = gearBonus
    }
}