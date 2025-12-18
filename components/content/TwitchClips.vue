<script setup lang="ts">
const parentURL="localhost"
const clips = [
    "RacyCredulousGarbageBigBrother-s2-xpBBpRz97iKv7",
    "CrowdedSilkyOxHeyGirl-n7_yX7xN70UFjSHd",
    "HotSnappyGerbilAsianGlow-X9bZeYPZbhM130Xm",
    "FancyAltruisticLampUncleNox-RzYj60mh9NO80GgF",
    "AltruisticSassyPastaKappaClaus-3SjpQ_i294eJ91L2",
    "ColorfulSparklingSquirrelHoneyBadger-nVnPcIOb_MsLM_5Y"
]
</script>
<template>
    <div class="flex flex-row gap-2 overflow-x-auto">
        <iframe v-for="clip in clips"
            :src="`https://clips.twitch.tv/embed?clip=${clip}&parent=${parentURL}`"
            height="378" width="620" class="w-[620px] flex-shrink-0">
        </iframe>
    </div>
</template>