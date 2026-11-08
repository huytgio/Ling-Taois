extends SceneTree
func _initialize() -> void:
 call_deferred("run")
func run() -> void:
 var scene = load("res://main.tscn").instantiate()
 root.add_child(scene)
 await process_frame
 assert(scene.cards.size() == 3)
 assert(scene.attack_button.disabled)
 scene.select_card(0)
 scene.select_card(1)
 assert(not scene.attack_button.disabled)
 scene.strike()
 assert(scene.boss_hp == 230)
 assert(scene.selected.is_empty())
 scene.reset_battle()
 assert(scene.boss_hp == 300)
 for turn in range(3):
  for i in range(3):scene.select_card(i)
  scene.strike()
 assert(scene.boss_hp == 0)
 assert(scene.attack_button.disabled)
 print("PASS: Godot scene, card selection, damage, reset, victory and attack guard.")
 quit(0)
