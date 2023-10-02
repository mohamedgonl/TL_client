<GameFile>
  <PropertyGroup Name="TroopTrainPopup" Type="Node" ID="3db1347a-fa68-4039-a0c3-8720855dcb45" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Node" Tag="92" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="Panel_1" ActionTag="554110726" Tag="249" IconVisible="False" LeftMargin="-568.0000" RightMargin="-568.0000" TopMargin="-320.0000" BottomMargin="-320.0000" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
            <Size X="1136.0000" Y="640.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <SingleColor A="255" R="80" G="80" B="80" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="button_prev" ActionTag="-253399139" UserData="-press_action" Tag="80" IconVisible="False" LeftMargin="-409.5000" RightMargin="360.5000" TopMargin="-56.0000" BottomMargin="-56.0000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="19" Scale9Height="90" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="49.0000" Y="112.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="-385.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <TextColor A="255" R="65" G="65" B="70" />
            <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
            <PressedFileData Type="Normal" Path="guis/train_troop_gui/previous.png" Plist="" />
            <NormalFileData Type="Normal" Path="guis/train_troop_gui/previous.png" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="button_next" ActionTag="512477618" UserData="-press_action" Tag="81" IconVisible="False" LeftMargin="360.5000" RightMargin="-409.5000" TopMargin="-56.0000" BottomMargin="-56.0000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="19" Scale9Height="90" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="49.0000" Y="112.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="385.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <TextColor A="255" R="65" G="65" B="70" />
            <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
            <PressedFileData Type="Normal" Path="guis/train_troop_gui/forward.png" Plist="" />
            <NormalFileData Type="Normal" Path="guis/train_troop_gui/forward.png" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="train_popup" ActionTag="-1574510530" Tag="79" IconVisible="False" LeftMargin="-369.5000" RightMargin="-369.5000" TopMargin="-238.0000" BottomMargin="-238.0000" LeftEage="243" RightEage="243" TopEage="157" BottomEage="157" Scale9OriginX="243" Scale9OriginY="157" Scale9Width="253" Scale9Height="162" ctype="ImageViewObjectData">
            <Size X="739.0000" Y="476.0000" />
            <Children>
              <AbstractNodeData Name="title" ActionTag="-1784389344" Tag="82" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="327.0000" RightMargin="327.0000" TopMargin="16.0600" BottomMargin="434.9400" LabelText="Nhà lính" ctype="TextBMFontObjectData">
                <Size X="85.0000" Y="25.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="369.5000" Y="447.4400" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.9400" />
                <PreSize X="0.1150" Y="0.0525" />
                <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_16.fnt" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="training_container" ActionTag="1988282960" Tag="84" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="28.5000" RightMargin="28.5000" TopMargin="51.9800" BottomMargin="309.0200" ctype="SpriteObjectData">
                <Size X="682.0000" Y="115.0000" />
                <Children>
                  <AbstractNodeData Name="queue_bg" ActionTag="-453233695" Tag="113" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="34.7000" RightMargin="239.3000" TopMargin="21.3000" BottomMargin="39.7000" ctype="SpriteObjectData">
                    <Size X="408.0000" Y="54.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="238.7000" Y="66.7000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.3500" Y="0.5800" />
                    <PreSize X="0.5982" Y="0.4696" />
                    <FileData Type="Normal" Path="guis/research troop/mui ten.png" Plist="" />
                    <BlendFunc Src="1" Dst="771" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="wait_troop" ActionTag="1311945419" Tag="133" IconVisible="True" LeftMargin="360.0000" RightMargin="322.0000" TopMargin="48.0000" BottomMargin="67.0000" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                    <Size X="0.0000" Y="0.0000" />
                    <AnchorPoint />
                    <Position X="360.0000" Y="67.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5279" Y="0.5826" />
                    <PreSize X="0.0000" Y="0.0000" />
                    <FileData Type="Normal" Path="TroopTrainingItem.csd" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="total_troop_string" ActionTag="-385913310" Tag="114" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="112.7000" RightMargin="317.3000" TopMargin="85.9500" BottomMargin="10.0500" LabelText="Tổng số quân sau khi huấn luyện:  " ctype="TextBMFontObjectData">
                    <Size X="252.0000" Y="19.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="238.7000" Y="19.5500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.3500" Y="0.1700" />
                    <PreSize X="0.3695" Y="0.1652" />
                    <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_12.fnt" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="CurrentTroopTraining" ActionTag="1708261671" Tag="127" IconVisible="True" LeftMargin="484.2300" RightMargin="197.7700" TopMargin="48.3000" BottomMargin="66.7000" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                    <Size X="0.0000" Y="0.0000" />
                    <AnchorPoint />
                    <Position X="484.2300" Y="66.7000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.7100" Y="0.5800" />
                    <PreSize X="0.0000" Y="0.0000" />
                    <FileData Type="Normal" Path="TroopTrainingItem.csd" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="total_time_title" ActionTag="1236311239" Tag="115" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="556.3000" RightMargin="10.7000" TopMargin="-1.4500" BottomMargin="97.4500" LabelText="Tổng thời gian:" ctype="TextBMFontObjectData">
                    <Size X="115.0000" Y="19.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="613.8000" Y="106.9500" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.9000" Y="0.9300" />
                    <PreSize X="0.1686" Y="0.1652" />
                    <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_12.fnt" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="total_time_string" ActionTag="-1252788043" Tag="116" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="592.8000" RightMargin="47.2000" TopMargin="17.0000" BottomMargin="66.0000" LabelText="0s" ctype="TextBMFontObjectData">
                    <Size X="42.0000" Y="32.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="613.8000" Y="82.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.9000" Y="0.7130" />
                    <PreSize X="0.0616" Y="0.2783" />
                    <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_20.fnt" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="done_now_title" ActionTag="1062277194" Tag="117" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="544.8000" RightMargin="-0.8000" TopMargin="44.5000" BottomMargin="51.5000" LabelText="Hoàn thành ngay:" ctype="TextBMFontObjectData">
                    <Size X="138.0000" Y="19.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="613.8000" Y="61.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.9000" Y="0.5304" />
                    <PreSize X="0.2023" Y="0.1652" />
                    <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_12.fnt" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="button_done_now" ActionTag="341666274" Tag="118" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="553.3000" RightMargin="7.7000" TopMargin="67.0000" ctype="SpriteObjectData">
                    <Size X="121.0000" Y="48.0000" />
                    <Children>
                      <AbstractNodeData Name="g_icon_13" ActionTag="895038916" Tag="119" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="82.9500" RightMargin="6.0500" TopMargin="9.5000" BottomMargin="9.5000" ctype="SpriteObjectData">
                        <Size X="32.0000" Y="29.0000" />
                        <AnchorPoint ScaleX="1.0000" ScaleY="0.5000" />
                        <Position X="114.9500" Y="24.0000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.9500" Y="0.5000" />
                        <PreSize X="0.2645" Y="0.6042" />
                        <FileData Type="Normal" Path="guis/train_troop_gui/g_icon.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="done_now_cost" ActionTag="-1431725656" Tag="120" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="50.0000" RightMargin="50.0000" TopMargin="14.5000" BottomMargin="14.5000" LabelText="9" ctype="TextBMFontObjectData">
                        <Size X="21.0000" Y="19.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="60.5000" Y="24.0000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="0.1736" Y="0.3958" />
                        <LabelBMFontFile_CNB Type="Normal" Path="fonts/soji_12.fnt" Plist="" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="613.8000" Y="24.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.9000" Y="0.2087" />
                    <PreSize X="0.1774" Y="0.4174" />
                    <FileData Type="Normal" Path="guis/research troop/button.png" Plist="" />
                    <BlendFunc Src="1" Dst="771" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="369.5000" Y="366.5200" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.7700" />
                <PreSize X="0.9229" Y="0.2416" />
                <FileData Type="Normal" Path="guis/research troop/mieng trang.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
              <AbstractNodeData Name="panel" ActionTag="-1229194072" Tag="94" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="36.0000" RightMargin="36.0000" TopMargin="198.0000" BottomMargin="78.0000" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
                <Size X="667.0000" Y="200.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="369.5000" Y="178.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.3739" />
                <PreSize X="0.9026" Y="0.4202" />
                <SingleColor A="255" R="150" G="200" B="255" />
                <FirstColor A="255" R="150" G="200" B="255" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="guis/research troop/nen 1.png" Plist="" />
          </AbstractNodeData>
          <AbstractNodeData Name="button_close" ActionTag="-1987398070" UserData="-press_action" Tag="83" IconVisible="False" LeftMargin="310.5000" RightMargin="-357.5000" TopMargin="-234.5000" BottomMargin="187.5000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="17" Scale9Height="25" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="47.0000" Y="47.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="334.0000" Y="211.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <TextColor A="255" R="65" G="65" B="70" />
            <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
            <PressedFileData Type="Normal" Path="guis/train_troop_gui/close.png" Plist="" />
            <NormalFileData Type="Normal" Path="guis/train_troop_gui/close.png" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>