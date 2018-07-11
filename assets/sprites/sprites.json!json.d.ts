type rect = {
  x: number
  y: number
  w: number
  h: number
}

type size = {
  w: number
  h: number
}

type framename = "background" | "blank" | "blackrock1" | "blackrockshadow1" | "blackstone1" | "blackstone2" | "blackstone3" | "blackstoneblock1" | "blackstoneblock2" | "blackstoneblock3" | "blackstoneedge" | "block" | "block-2x2" | "block-3x3" | "block-middle" | "chainturret" | "chainturret-icon" | "chainturret-icon_old" | "chainturret_old" | "coal1" | "coal2" | "coal3" | "coaldrill" | "coalgenerator" | "coalgenerator-top" | "coalpurifier" | "combustiongenerator" | "compositewall" | "conduit" | "conduitbottom" | "conduitliquid" | "conduittop" | "conveyor" | "conveyormove" | "conveyortunnel" | "core" | "cross" | "crucible" | "deepwater" | "dirt1" | "dirt2" | "dirt3" | "dirtedge" | "door" | "door-large" | "door-large-icon" | "door-large-open" | "door-open" | "doubleturret" | "duriumwall" | "duriumwall-large" | "duriumwall-large-icon" | "enemyspawn" | "flameturret" | "fluxpump" | "grass1" | "grass2" | "grass3" | "grassblock1" | "grassblock2" | "grassedge" | "ice1" | "ice2" | "ice3" | "iceedge" | "icerock1" | "icerock2" | "icerockshadow1" | "rockshadow1" | "icerockshadow2" | "rockshadow2" | "iron1" | "iron2" | "iron3" | "irondrill" | "ironwall" | "junction" | "laserturret" | "lava" | "lavaedge" | "lavasmelter" | "liquiditemjunction" | "liquidjunction" | "liquidrouter" | "machineturret" | "megarepairturret" | "mortarturret" | "mossblock" | "mossstone" | "nuclearreactor" | "nuclearreactor-center" | "nuclearreactor-icon" | "nuclearreactor-lights" | "nuclearreactor-small" | "oil" | "oiledge" | "oilrefinery" | "omnidrill" | "plasmaturret" | "playerspawn" | "powerbooster" | "poweredconveyor" | "poweredconveyormove" | "powerlaser" | "powerlasercorner" | "powerlaserrouter" | "pulseconduit" | "pulseconduitbottom" | "pulseconduittop" | "pump" | "repairturret" | "rock1" | "rock2" | "router" | "rtgenerator" | "rtgenerator-top" | "sand1" | "sand2" | "sand3" | "sandblock1" | "sandblock2" | "sandblock3" | "sandedge" | "shadow" | "shieldgenerator" | "shotgunturret" | "shrub" | "shrubshadow" | "smelter" | "smelter-middle" | "sniperturret" | "snow1" | "snow2" | "snow3" | "snowblock1" | "snowblock2" | "snowblock3" | "snowedge" | "sorter" | "steelconveyor" | "steelconveyormove" | "steelwall" | "steelwall-large" | "steelwall-large-icon" | "stone1" | "stone2" | "stone3" | "stoneblock1" | "stoneblock2" | "stoneblock3" | "stonedrill" | "stoneedge" | "stoneformer" | "stonewall" | "teleporter" | "teleporter-top" | "thermalgenerator" | "titancannon" | "titancannon-icon" | "titancannon-icon_old" | "titancannon_old" | "titanium1" | "titanium2" | "titanium3" | "titaniumdrill" | "titaniumpurifier" | "titaniumshieldwall" | "titaniumwall" | "titaniumwall-large" | "titaniumwall-large-icon" | "turret" | "uranium1" | "uranium2" | "uranium3" | "uraniumdrill" | "water" | "wateredge" | "waveturret" | "weaponfactory" | "weaponfactory-icon" | "bullet" | "chainbullet" | "circle" | "circle2" | "blastenemy-t1" | "blastenemy-t2" | "blastenemy-t3" | "empenemy-t1" | "empenemy-t2" | "empenemy-t3" | "fastenemy-t1" | "fastenemy-t2" | "fastenemy-t3" | "flamerenemy-t1" | "flamerenemy-t2" | "flamerenemy-t3" | "fortressenemy-t1" | "fortressenemy-t2" | "fortressenemy-t3" | "healerenemy-t1" | "healerenemy-t2" | "healerenemy-t3" | "mortarenemy-t1" | "mortarenemy-t2" | "mortarenemy-t3" | "rapidenemy-t1" | "rapidenemy-t2" | "rapidenemy-t3" | "standardenemy-t1" | "targetenemy-t1" | "standardenemy-t2" | "standardenemy-t3" | "tankenemy-t1" | "tankenemy-t2" | "tankenemy-t3" | "titanenemy-t1" | "titanenemy-t2" | "titanenemy-t3" | "enemyarrow" | "icon-coal" | "icon-dirium" | "icon-iron" | "icon-sand" | "icon-steel" | "icon-stone" | "icon-titanium" | "icon-uranium" | "laser" | "laserend" | "laserfull" | "mech-standard" | "mech-standard-icon" | "ship-standard" | "shell" | "shot" | "shot-long" | "titanshell" | "border" | "button" | "button-down" | "button-over" | "button-map" | "button-map-down" | "button-map-over" | "button-select" | "check-off" | "check-on" | "check-on-over" | "check-over" | "clear" | "cursor" | "discord-banner" | "discord-banner-over" | "controller-cursor" | "icon-about" | "icon-add" | "icon-admin" | "icon-admin-small" | "icon-areaDelete" | "icon-arrow" | "icon-arrow-down" | "icon-arrow-left" | "icon-arrow-right" | "icon-arrow-up" | "icon-back" | "icon-ban" | "icon-cancel" | "icon-chat" | "icon-check" | "icon-close" | "icon-close-down" | "icon-close-over" | "icon-crafting" | "icon-cursor" | "icon-defense" | "icon-dev-builds" | "icon-discord" | "icon-distribution" | "icon-donate" | "icon-dots" | "icon-editor" | "icon-exit" | "icon-file-text" | "icon-fill" | "icon-floppy" | "icon-folder" | "icon-folder-parent" | "icon-github" | "icon-google-play" | "icon-grid" | "icon-hold" | "icon-holdDelete" | "icon-home" | "icon-host" | "icon-info" | "icon-itch.io" | "icon-line" | "icon-link" | "icon-load" | "icon-load-image" | "icon-load-map" | "icon-loading" | "icon-menu" | "icon-none" | "icon-pause" | "icon-pencil" | "icon-pencil-small" | "icon-pick" | "icon-play" | "icon-play-2" | "icon-players" | "icon-power" | "icon-production" | "icon-quit" | "icon-redo" | "icon-refresh" | "icon-rename" | "icon-resize" | "icon-rotate" | "icon-rotate-arrow" | "icon-rotate-left" | "icon-rotate-right" | "icon-save" | "icon-save-image" | "icon-save-map" | "icon-settings" | "icon-terrain" | "icon-tools" | "icon-touch" | "icon-touchDelete" | "icon-trash" | "icon-trash-16" | "icon-trello" | "icon-tutorial" | "icon-undo" | "icon-weapon" | "icon-wiki" | "icon-zoom" | "icon-zoom-small" | "logotext" | "pane" | "pane-button" | "scroll" | "scroll-horizontal" | "scroll-knob-horizontal" | "scroll-knob-vertical" | "scroll-knob-vertical-black" | "selection" | "slider" | "slider-knob" | "slider-knob-down" | "slider-knob-over" | "slider-vertical" | "text-sides" | "text-sides-down" | "text-sides-over" | "textfield" | "textfield-over" | "white" | "window" | "window-empty" | "beam" | "beam-equip" | "blaster" | "blaster-equip" | "clustergun" | "clustergun-equip" | "shockgun" | "shockgun-equip" | "triblaster" | "triblaster-equip" | "vulcan" | "vulcan-equip"

declare const data: {
  meta: {
    image: string
    size: {
      w: number
      h: number
    }
    scale: number
  }
  frames: {
    [key in framename]: {
      trimmed: boolean
      rotated: boolean
      frame: rect
      spriteSourceSize: rect
      sourceSize: size
    }
  }
};
export = data;