extends Control

const INK := Color("efdfb8")
const JADE := Color("83d5b7")
const CARD_COLORS := [Color("f0cf7c"), Color("83d5b7"), Color("f09377")]
var selected: Array[int] = []
var boss_hp := 300
var cards: Array[Button] = []
var status: Label
var hp_label: Label
var hp_bar: ProgressBar
var attack_button: Button
var labels: Array[Label] = []
var card_row: HBoxContainer
var margin: MarginContainer

func panel_style(color: Color, fill: Color) -> StyleBoxFlat:
 var style := StyleBoxFlat.new()
 style.bg_color = fill
 style.border_color = color
 style.set_border_width_all(2)
 style.set_corner_radius_all(12)
 style.content_margin_left = 14
 style.content_margin_right = 14
 style.content_margin_top = 8
 style.content_margin_bottom = 8
 return style

func text(value: String, size: int, color: Color = INK) -> Label:
 var label := Label.new()
 label.text = value
 label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
 label.set_meta("base_size", size)
 labels.append(label)
 label.add_theme_font_size_override("font_size", size)
 label.add_theme_color_override("font_color", color)
 label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
 return label

func _ready() -> void:
 margin = MarginContainer.new()
 margin.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
 for edge in ["left", "right", "top", "bottom"]:
  margin.add_theme_constant_override("margin_" + edge, 16)
 add_child(margin)
 var column := VBoxContainer.new()
 column.add_theme_constant_override("separation", 10)
 margin.add_child(column)
 column.add_child(text("LINH ĐẠO · GODOT", 24))
 column.add_child(text("BẢN KIỂM TRA ENGINE · 4.5.1 · CHƯA PHẢI GAME ĐẦY ĐỦ", 12, JADE))
 var boss := PanelContainer.new()
 boss.add_theme_stylebox_override("panel", panel_style(Color("b18b71"), Color("172735")))
 column.add_child(boss)
 var boss_column := VBoxContainer.new()
 boss.add_child(boss_column)
 hp_label = text("SƠN QUỶ · 300 / 300 HP", 20)
 boss_column.add_child(hp_label)
 hp_bar = ProgressBar.new()
 hp_bar.max_value = 300
 hp_bar.value = 300
 hp_bar.show_percentage = false
 hp_bar.custom_minimum_size.y = 8
 boss_column.add_child(hp_bar)
 card_row = HBoxContainer.new()
 card_row.add_theme_constant_override("separation", 12)
 card_row.size_flags_vertical = Control.SIZE_EXPAND_FILL
 column.add_child(card_row)
 for i in range(3):
  var button := Button.new()
  button.toggle_mode = true
  button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
  button.add_theme_color_override("font_color", CARD_COLORS[i])
  button.add_theme_color_override("font_pressed_color", Color("fff2d3"))
  button.add_theme_stylebox_override("normal", panel_style(CARD_COLORS[i].darkened(0.3), Color("152a37")))
  button.add_theme_stylebox_override("pressed", panel_style(CARD_COLORS[i], Color("345348")))
  button.add_theme_stylebox_override("hover", panel_style(CARD_COLORS[i], Color("243d46")))
  button.add_theme_stylebox_override("focus", panel_style(JADE, Color(0,0,0,0)))
  button.text = ["KIM KIẾM", "MỘC KIẾM", "HỎA KIẾM"][i] + "\n\nSơ Linh\n35 sát thương"
  button.pressed.connect(select_card.bind(i))
  cards.append(button)
  card_row.add_child(button)
 status = text("Chạm để chọn 1–3 lá rồi xuất chiêu.", 14, JADE)
 column.add_child(status)
 var actions := HBoxContainer.new()
 actions.add_theme_constant_override("separation", 12)
 column.add_child(actions)
 column.add_child(text("Godot Engine · MIT · godotengine.org/license", 10, JADE))
 var reset := Button.new()
 reset.text = "Thử lại"
 reset.custom_minimum_size = Vector2(110, 44)
 reset.pressed.connect(reset_battle)
 actions.add_child(reset)
 attack_button = Button.new()
 attack_button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
 attack_button.custom_minimum_size.y = 44
 attack_button.add_theme_stylebox_override("normal", panel_style(Color("eed494"), Color("94713e")))
 attack_button.pressed.connect(strike)
 actions.add_child(attack_button)
 resized.connect(fit_cards)
 fit_cards()
 update_ui()

func fit_cards() -> void:
 var factor := clampf(minf(size.x, size.y) / 390.0, 0.8, 2.5)
 for label in labels:
  label.add_theme_font_size_override("font_size", int(label.get_meta("base_size")) * factor)
 for button in cards:
  button.add_theme_font_size_override("font_size", int((15 if size.x < 600 else 20) * factor))
 card_row.add_theme_constant_override("separation", int(8 * factor))
 for edge in ["left", "right", "top", "bottom"]:
  margin.add_theme_constant_override("margin_" + edge, int(12 * factor))
 attack_button.add_theme_font_size_override("font_size", int(16 * factor))

func select_card(i: int) -> void:
 if boss_hp <= 0:
  cards[i].button_pressed = false
  return
 if selected.has(i):
  selected.erase(i)
 else:
  selected.append(i)
 cards[i].button_pressed = selected.has(i)
 update_ui()

func strike() -> void:
 if selected.is_empty() or boss_hp <= 0:
  return
 var damage := selected.size() * 35
 boss_hp = maxi(0, boss_hp - damage)
 selected.clear()
 for button in cards:
  button.button_pressed = false
 status.text = "−%d sát thương · %s" % [damage, "Đã hạ boss!" if boss_hp == 0 else "Chạm bài để đánh tiếp."]
 update_ui()
 if not DisplayServer.get_name() == "headless":
  var tween := create_tween()
  tween.tween_property(hp_label, "modulate", Color("ff886c"), 0.08)
  tween.tween_property(hp_label, "modulate", Color.WHITE, 0.18)

func reset_battle() -> void:
 boss_hp = 300
 selected.clear()
 for button in cards:
  button.button_pressed = false
 status.text = "Chạm để chọn 1–3 lá rồi xuất chiêu."
 update_ui()

func update_ui() -> void:
 hp_label.text = "SƠN QUỶ · %d / 300 HP" % boss_hp
 hp_bar.value = boss_hp
 attack_button.text = "Xuất chiêu · %d ST ↗" % (selected.size() * 35)
 attack_button.disabled = selected.is_empty() or boss_hp <= 0
