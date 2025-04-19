export default class Player {
    constructor(socketId, name, level = 1, gearBonus = 0){
        this.socketId = socketId
        this.name = name
        this.level = level
        this.gearBonus = gearBonus
    }
}