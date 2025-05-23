document.addEventListener("DOMContentLoaded", function () {
    const characterSelect = document.getElementById("characterSelect");
    const infoDiv = document.getElementById("info");

    characterSelect.addEventListener("change", () => {
        const selected = characterSelect.value;
        if (!selected) {
            infoDiv.innerHTML = "";
            return;
        }

        fetch("data.json")
            .then(res => res.json())
            .then(data => {
                const char = data[selected].ArmoryProfile;
                if (!char) {
                    infoDiv.innerHTML = `<p>${selected}의 정보를 찾을 수 없습니다.</p>`;
                    return;
                }

                infoDiv.innerHTML =
                    "<h2>" + char.CharacterName + " (" + char.CharacterClassName + ")</h2>" +
                    "<p><strong>아이템 레벨:</strong> " + char.ItemMaxLevel + "</p>" +
                    "<p><strong>서버:</strong> " + char.ServerName + "</p>" +
                    "<p><strong>길드:</strong> " + (char.GuildName || "없음") + "</p>" +
                    "<p><strong>PvP:</strong> " + (char.PvpGradeName || "정보 없음") + "</p>";
            })
            .catch(err => {
                infoDiv.innerHTML = "데이터를 불러오는 데 실패했습니다.";
            });
    });
});
