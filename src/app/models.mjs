export class Combat {
    constructor(partyModifier = 0, monsterModifier = 0) {
        this.partyModifier = partyModifier
        this.monsterModifier = monsterModifier
    }
}

export class Player {
    constructor(connId, name, level = 1, gearBonus = 0, helping = false){
        this.connId = connId
        this.name = name
        this.level = level
        this.gearBonus = gearBonus
        this.helping = helping
        this.combat = new Combat()
    }
}