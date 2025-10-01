import deepFreeze from "deep-freeze"
import baby from "../res/player-profiles/baby_fixed.jpg"
import bullrog from "../res/player-profiles/Bullrog_fixed.jpg"
import dragon from "../res/player-profiles/dragon_fixed.jpg"
import staffOfNapalm from "../res/player-profiles/staff_of_napalm_fixed.jpg"
import vampire from "../res/player-profiles/vampire_fixed.jpg"
import dwarf from "../res/player-profiles/dwarf_fixed.jpg"
import elf from "../res/player-profiles/elf_fixed.jpg"
import gazebo from "../res/player-profiles/gazebo_fixed.jpg"
import orc from "../res/player-profiles/orc_fixed.jpg"


export const PICTURES = deepFreeze({
    BABY: baby,
    BULLROG: bullrog,
    DRAGON: dragon,
    STAFF_OF_NAPALM: staffOfNapalm,
    VAMPIRE: vampire,
    DWARF: dwarf,
    ELF: elf,
    GAZEBO: gazebo,
    ORC: orc
})