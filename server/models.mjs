export class Combat {
    constructor(partyModifier = 0, monsterModifier = 0) {
        this.partyModifier = partyModifier
        this.monsterModifier = monsterModifier
    }
}

export class Player {
    constructor(connId, name, picture, level = 1, gearBonus = 0, helping = [], combat = new Combat(), lastInteractedTime = Date.now()){
        this.connId = connId
        this.name = name
        this.picture = picture
        this.level = level
        this.gearBonus = gearBonus
        this.helping = helping
        this.combat = combat
        this.lastInteractedTime = lastInteractedTime
    }
}