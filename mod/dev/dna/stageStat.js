function zapStageStat() {
    _.stageStat = {

        evo: function(dt) {
            if (!env.stat) return

            // polygons
            const polygons = env.stat.lastPolygons
            env.dump['Polygons'] = `${polygons} (${polygons * env.fps}/s)`

            // surfaces
            let iobj = 0
            lab.apply(e => { if (e.surface) iobj++ })
            env.dump['Object'] = '' + iobj

            let inodes = 0
            lab.apply(e => inodes++ )
            env.dump['Nodes'] = '' + inodes
        }
    }
}
